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

  const blogs = readBlogs();

  switch (method) {
    case 'GET':
      const blog = blogs.find(b => b.id === blogId);
      
      if (!blog) {
        return res.status(404).json({ success: false, message: 'Блог не знайдено' });
      }
      
      res.status(200).json({ success: true, data: blog });
      break;

    case 'PUT':
      const blogIndex = blogs.findIndex(b => b.id === blogId);
      
      if (blogIndex === -1) {
        return res.status(404).json({ success: false, message: 'Блог не знайдено' });
      }

      // Перерахувати час читання якщо контент змінився
      const readTime = req.body.content 
        ? calculateReadTime(req.body.content)
        : blogs[blogIndex].readTime;
      
      const updatedBlog = {
        ...blogs[blogIndex],
        ...req.body,
        readTime,
        id: blogId,
        updatedAt: new Date().toISOString()
      };
      
      blogs[blogIndex] = updatedBlog;
      
      if (writeBlogs(blogs)) {
        res.status(200).json({ success: true, data: updatedBlog });
      } else {
        res.status(500).json({ success: false, message: 'Помилка оновлення блогу' });
      }
      break;

    case 'DELETE':
      const deleteIndex = blogs.findIndex(b => b.id === blogId);
      
      if (deleteIndex === -1) {
        return res.status(404).json({ success: false, message: 'Блог не знайдено' });
      }
      
      const deletedBlog = blogs[deleteIndex];
      blogs.splice(deleteIndex, 1);
      
      if (writeBlogs(blogs)) {
        res.status(200).json({ success: true, data: deletedBlog });
      } else {
        res.status(500).json({ success: false, message: 'Помилка видалення блогу' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
