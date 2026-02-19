import db from '../../../lib/database';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// Простий кеш в пам'яті
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 хвилин

function getCachedData(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedData(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

function clearCoursesCache() {
  // Очищаємо всі ключі що починаються з 'courses_'
  for (const key of cache.keys()) {
    if (key.startsWith('courses_')) {
      cache.delete(key);
    }
  }
  console.log('🗑️ Courses cache cleared');
}

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET': {
      try {
        try { db.exec('ALTER TABLE courses ADD COLUMN featured_image TEXT'); } catch (e) {}
        const { all, course_type } = req.query;
        const useActiveOnly = !all; // by default return only active

        // Створюємо ключ кешу
        const cacheKey = `courses_${useActiveOnly ? 'active' : 'all'}_${course_type || 'any'}`;
        
        // Перевіряємо кеш
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          console.log('📦 Returning cached courses data');
          res.setHeader('Cache-Control', 'public, max-age=300'); // 5 хвилин
          return res.status(200).json({ success: true, data: cachedData });
        }

        let whereClauses = [];
        let params = {};

        if (useActiveOnly) {
          whereClauses.push('is_active = 1');
        }

        if (course_type) {
          whereClauses.push('course_type = @course_type');
          params.course_type = String(course_type);
        }

        let query = 'SELECT * FROM courses';
        if (whereClauses.length > 0) {
          query += ' WHERE ' + whereClauses.join(' AND ');
        }
        query += ' ORDER BY created_at DESC';

        console.log('🔍 Fetching courses from database');
        const stmt = db.prepare(query);
        const courses = Object.keys(params).length > 0 ? stmt.all(params) : stmt.all();
        
        // Зберігаємо в кеш
        setCachedData(cacheKey, courses);
        
        res.setHeader('Cache-Control', 'public, max-age=300'); // 5 хвилин
        res.status(200).json({ success: true, data: courses });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, error: 'Помилка отримання курсів' });
      }
      break; }

    case 'POST': {
      try {
        const c = req.body || {};
        const insert = db.prepare(`
          INSERT INTO courses (
            title, subtitle, description_1, description_2, price, old_price, start_date,
            experience, group_info, duration, problem_title, problem_intro1, problem_intro2,
            result_title, result_list, result_conclusion, solution_title, solution_intro,
            solution_how_title, solution_list, solution_conclusion, modules, themes, curators,
            author_name, author_bio_1, author_bio_2, author_photo, telegram_link, course_type, is_active, featured_image
          ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `);

        const result = insert.run(
          c.title,
          c.subtitle || null,
          c.description1 || null,
          c.description2 || null,
          c.price || null,
          c.oldPrice || null,
          c.startDate || null,
          c.experience || null,
          c.groupInfo || null,
          c.duration || null,
          c.problemTitle || null,
          c.problemIntro1 || null,
          c.problemIntro2 || null,
          c.resultTitle || null,
          c.resultList || null,
          c.resultConclusion || null,
          c.solutionTitle || null,
          c.solutionIntro || null,
          c.solutionHowTitle || null,
          c.solutionList || null,
          c.solutionConclusion || null,
          c.modules || null,
          c.themes || null,
          c.curators || null,
          c.authorName || null,
          c.authorBio1 || null,
          c.authorBio2 || null,
          c.authorPhoto || null,
          c.telegramLink || null,
          c.courseType || 'regular',
          c.isActive ? 1 : 0,
          c.featuredImage || c.featured_image || null
        );

        const created = db.prepare('SELECT * FROM courses WHERE id = ?').get(result.lastInsertRowid);
        
        // Очищаємо кеш після створення нового курсу
        clearCoursesCache();
        
        res.status(201).json({ success: true, data: created });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Помилка створення курсу' });
      }
      break; }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
