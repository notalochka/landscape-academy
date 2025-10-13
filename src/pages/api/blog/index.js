import fs from 'fs';
import path from 'path';

// Збільшуємо ліміт для великих зображень
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// Шлях до JSON файлу
const blogsFilePath = path.join(process.cwd(), 'data', 'blogs.json');

// Функції для роботи з файлом
const readBlogs = () => {
  try {
    const fileContents = fs.readFileSync(blogsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Помилка читання файлу блогів:', error);
    return [];
  }
};

const writeBlogs = (blogs) => {
  try {
    fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Помилка запису файлу блогів:', error);
    return false;
  }
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
      const blogs = readBlogs();
      const { published, page, limit } = req.query;
      let filteredBlogs = [...blogs];
      
      // Фільтр по опублікованим
      if (published === 'true') {
        filteredBlogs = filteredBlogs.filter(blog => blog.isPublished);
      }
      
      // Сортування за датою (новіші спочатку)
      filteredBlogs = filteredBlogs.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Пагінація
      if (page && limit) {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        
        const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);
        
        return res.status(200).json({ 
          success: true, 
          data: paginatedBlogs,
          total: filteredBlogs.length,
          page: pageNum,
          totalPages: Math.ceil(filteredBlogs.length / limitNum)
        });
      }
      
      res.status(200).json({ success: true, data: filteredBlogs });
      break;

    case 'POST':
      const allBlogs = readBlogs();
      const readTime = calculateReadTime(req.body.content || '');
      
      const newBlog = {
        id: Date.now(),
        ...req.body,
        readTime,
        createdAt: new Date().toISOString()
      };
      
      allBlogs.push(newBlog);
      
      if (writeBlogs(allBlogs)) {
        res.status(201).json({ success: true, data: newBlog });
      } else {
        res.status(500).json({ success: false, message: 'Помилка збереження блогу' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
