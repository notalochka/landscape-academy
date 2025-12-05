import db from '../../../lib/database';
import { defaultBlogs } from '../../../data/defaultData';

// Збільшуємо ліміт для великих зображень
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// Функція для підрахунку часу читання (приблизно 200 слів на хвилину)
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} хв читання`;
}

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { published, page, limit } = req.query;
        
        // Check if we're in production (Vercel) and use default data
        if (process.env.NODE_ENV === 'production' && !db) {
          let blogs = defaultBlogs.map(blog => ({
            ...blog,
            image: blog.featured_image || blog.image || null,
            tag: blog.tag || null
          }));
          
          if (published === 'true') {
            blogs = blogs.filter(blog => blog.published === 1);
          }
          
          // Пагінація
          if (page && limit) {
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const startIndex = (pageNum - 1) * limitNum;
            const endIndex = startIndex + limitNum;
            
            const paginatedBlogs = blogs.slice(startIndex, endIndex);
            
            return res.status(200).json({ 
              success: true, 
              data: paginatedBlogs,
              total: blogs.length,
              page: pageNum,
              totalPages: Math.ceil(blogs.length / limitNum)
            });
          }
          
          return res.status(200).json({ success: true, data: blogs });
        }
        
        let query = 'SELECT * FROM blogs';
        let params = [];
        
        // Фільтр по опублікованим
        if (published === 'true') {
          query += ' WHERE published = 1';
        }
        
        query += ' ORDER BY created_at DESC';
        
        let blogs = db.prepare(query).all(params);
        
        // Додаємо час читання до кожного блогу та мапимо поля
        blogs = blogs.map(blog => ({
          ...blog,
          readTime: calculateReadTime(blog.content || ''),
          isPublished: blog.published === 1,
          createdAt: blog.created_at,
          image: blog.featured_image || blog.image || null,
          tag: blog.tag || null
        }));

        // Пагінація
        if (page && limit) {
          const pageNum = parseInt(page);
          const limitNum = parseInt(limit);
          const startIndex = (pageNum - 1) * limitNum;
          const endIndex = startIndex + limitNum;
          
          const paginatedBlogs = blogs.slice(startIndex, endIndex);
          
          return res.status(200).json({ 
            success: true, 
            data: paginatedBlogs,
            total: blogs.length,
            page: pageNum,
            totalPages: Math.ceil(blogs.length / limitNum)
          });
        }
        
        res.status(200).json({ success: true, data: blogs });
      } catch (error) {
        console.error('Database error:', error);
        // Fallback to default data in case of database error
        let blogs = defaultBlogs.map(blog => ({
          ...blog,
          image: blog.featured_image || blog.image || null,
          tag: blog.tag || null
        }));
        const { published, page, limit } = req.query;
        
        if (published === 'true') {
          blogs = blogs.filter(blog => blog.published === 1);
        }
        
        // Пагінація
        if (page && limit) {
          const pageNum = parseInt(page);
          const limitNum = parseInt(limit);
          const startIndex = (pageNum - 1) * limitNum;
          const endIndex = startIndex + limitNum;
          
          const paginatedBlogs = blogs.slice(startIndex, endIndex);
          
          return res.status(200).json({ 
            success: true, 
            data: paginatedBlogs,
            total: blogs.length,
            page: pageNum,
            totalPages: Math.ceil(blogs.length / limitNum)
          });
        }
        
        res.status(200).json({ success: true, data: blogs });
      }
      break;

    case 'POST':
      try {
        const readTime = calculateReadTime(req.body.content || '');
        
        // Мапимо image на featured_image для збереження в БД
        const featuredImage = req.body.image || req.body.featured_image || null;
        const tag = req.body.tag || null;
        
        // Генеруємо slug з назви, якщо не вказано
        const slug = req.body.slug || req.body.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        const insertBlog = db.prepare(`
          INSERT INTO blogs (title, content, excerpt, author, featured_image, tag, slug, published)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const result = insertBlog.run(
          req.body.title,
          req.body.content,
          req.body.excerpt,
          req.body.author,
          featuredImage,
          tag,
          slug,
          req.body.isPublished ? 1 : 0
        );
        
        const newBlog = {
          id: result.lastInsertRowid,
          title: req.body.title,
          content: req.body.content,
          excerpt: req.body.excerpt,
          author: req.body.author,
          image: featuredImage,
          tag: tag,
          slug: slug,
          readTime,
          createdAt: new Date().toISOString(),
          isPublished: req.body.isPublished
        };
        
        res.status(201).json({ success: true, data: newBlog });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Помилка збереження блогу' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}