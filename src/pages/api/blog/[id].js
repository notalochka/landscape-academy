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

// Функція для підрахунку часу читання
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} хв читання`;
}

export default function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  const blogId = parseInt(id);

  switch (method) {
    case 'GET':
      try {
        // Check if we're in production (Vercel) and use default data
        if (process.env.NODE_ENV === 'production' && !db) {
          const blog = defaultBlogs.find(b => b.id === blogId);
          
          if (!blog) {
            return res.status(404).json({ success: false, message: 'Блог не знайдено' });
          }
          
          const blogWithMappedFields = {
            ...blog,
            image: blog.featured_image || blog.image || null,
            tag: blog.tag || null
          };
          
          return res.status(200).json({ success: true, data: blogWithMappedFields });
        }
        
        const blog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(blogId);
        
        if (!blog) {
          return res.status(404).json({ success: false, message: 'Блог не знайдено' });
        }
        
        // Додаємо час читання та мапимо поля
        const blogWithReadTime = {
          ...blog,
          readTime: calculateReadTime(blog.content || ''),
          isPublished: blog.published === 1,
          createdAt: blog.created_at,
          image: blog.featured_image || blog.image || null,
          tag: blog.tag || null
        };
        
        res.status(200).json({ success: true, data: blogWithReadTime });
      } catch (error) {
        console.error('Database error:', error);
        // Fallback to default data
        const blog = defaultBlogs.find(b => b.id === blogId);
        
        if (!blog) {
          return res.status(404).json({ success: false, message: 'Блог не знайдено' });
        }
        
        const blogWithMappedFields = {
          ...blog,
          image: blog.featured_image || blog.image || null,
          tag: blog.tag || null
        };
        
        res.status(200).json({ success: true, data: blogWithMappedFields });
      }
      break;

    case 'PUT':
      try {
        // Перевіряємо чи існує блог
        const existingBlog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(blogId);
        
        if (!existingBlog) {
          return res.status(404).json({ success: false, message: 'Блог не знайдено' });
        }

        // Перерахувати час читання якщо контент змінився
        const readTime = req.body.content 
          ? calculateReadTime(req.body.content)
          : calculateReadTime(existingBlog.content || '');
        
        // Мапимо image на featured_image для збереження в БД
        const featuredImage = req.body.image !== undefined 
          ? (req.body.image || null)
          : (req.body.featured_image !== undefined ? req.body.featured_image : existingBlog.featured_image);
        const tag = req.body.tag !== undefined ? (req.body.tag || null) : existingBlog.tag;
        
        const updateBlog = db.prepare(`
          UPDATE blogs 
          SET title = ?, content = ?, excerpt = ?, author = ?, 
              featured_image = ?, tag = ?, slug = ?, published = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        
        updateBlog.run(
          req.body.title !== undefined ? req.body.title : existingBlog.title,
          req.body.content !== undefined ? req.body.content : existingBlog.content,
          req.body.excerpt !== undefined ? req.body.excerpt : existingBlog.excerpt,
          req.body.author !== undefined ? req.body.author : existingBlog.author,
          featuredImage,
          tag,
          req.body.slug !== undefined ? req.body.slug : existingBlog.slug,
          req.body.isPublished !== undefined ? (req.body.isPublished ? 1 : 0) : existingBlog.published,
          blogId
        );
        
        // Отримуємо оновлений блог
        const updatedBlog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(blogId);
        const blogWithReadTime = {
          ...updatedBlog,
          readTime,
          isPublished: updatedBlog.published === 1,
          createdAt: updatedBlog.created_at,
          image: updatedBlog.featured_image || updatedBlog.image || null,
          tag: updatedBlog.tag || null
        };
        
        res.status(200).json({ success: true, data: blogWithReadTime });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Помилка оновлення блогу' });
      }
      break;

    case 'DELETE':
      try {
        // Перевіряємо чи існує блог
        const existingBlog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(blogId);
        
        if (!existingBlog) {
          return res.status(404).json({ success: false, message: 'Блог не знайдено' });
        }
        
        const deleteBlog = db.prepare('DELETE FROM blogs WHERE id = ?');
        deleteBlog.run(blogId);
        
        res.status(200).json({ success: true, data: existingBlog });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Помилка видалення блогу' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
