const db = require('../../../lib/database');

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { course_type, all, active } = req.query;
      const activeFilter = typeof active !== 'undefined' ? ((active === '1' || active === 'true') ? 1 : 0) : null;

      if (course_type) {
        if (all) {
          const stmt = db.prepare('SELECT * FROM courses WHERE course_type = ? ORDER BY id');
          const courses = stmt.all(course_type);
          return res.status(200).json({ success: true, data: courses });
        }
        if (activeFilter !== null) {
          const stmt = db.prepare('SELECT * FROM courses WHERE course_type = ? AND is_active = ? ORDER BY id');
          const courses = stmt.all(course_type, activeFilter);
          return res.status(200).json({ success: true, data: courses });
        }
        const stmt = db.prepare('SELECT * FROM courses WHERE course_type = ? AND is_active = 1 ORDER BY id');
        const courses = stmt.all(course_type);
        return res.status(200).json({ success: true, data: courses });
      }

      if (all) {
        const courses = db.prepare('SELECT * FROM courses ORDER BY course_type, id').all();
        return res.status(200).json({ success: true, data: courses });
      }
      if (activeFilter !== null) {
        const courses = db.prepare('SELECT * FROM courses WHERE is_active = ? ORDER BY course_type, id').all(activeFilter);
        return res.status(200).json({ success: true, data: courses });
      }
      const courses = db.prepare('SELECT * FROM courses WHERE is_active = 1 ORDER BY course_type, id').all();
      res.status(200).json({ success: true, data: courses });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: 'Помилка завантаження курсів' });
    }
  } else if (req.method === 'POST') {
    try {
      // Ensure new columns exist (in case the DB was created before code update)
      try { db.exec('ALTER TABLE courses ADD COLUMN experience TEXT'); } catch (e) {}
      try { db.exec('ALTER TABLE courses ADD COLUMN group_info TEXT'); } catch (e) {}
      try { db.exec('ALTER TABLE courses ADD COLUMN problem_title TEXT'); } catch (e) {}
      try { db.exec('ALTER TABLE courses ADD COLUMN problem_intro1 TEXT'); } catch (e) {}
      try { db.exec('ALTER TABLE courses ADD COLUMN problem_intro2 TEXT'); } catch (e) {}
      try { db.exec('ALTER TABLE courses ADD COLUMN result_title TEXT'); } catch (e) {}
      try { db.exec('ALTER TABLE courses ADD COLUMN result_list TEXT'); } catch (e) {}
      try { db.exec('ALTER TABLE courses ADD COLUMN result_conclusion TEXT'); } catch (e) {}
      try { db.exec('ALTER TABLE courses ADD COLUMN solution_title TEXT'); } catch (e) {}
      try { db.exec('ALTER TABLE courses ADD COLUMN solution_intro TEXT'); } catch (e) {}
      try { db.exec('ALTER TABLE courses ADD COLUMN solution_how_title TEXT'); } catch (e) {}
      try { db.exec('ALTER TABLE courses ADD COLUMN solution_list TEXT'); } catch (e) {}
      try { db.exec('ALTER TABLE courses ADD COLUMN solution_conclusion TEXT'); } catch (e) {}

      const {
        title,
        subtitle,
        description1,
        description2,
        price,
        oldPrice,
        startDate,
        experience,
        groupInfo,
        duration,
        problemTitle,
        problemIntro1,
        problemIntro2,
        resultTitle,
        resultList,
        resultConclusion,
        solutionTitle,
        solutionIntro,
        solutionHowTitle,
        solutionList,
        solutionConclusion,
        modules,
        themes,
        curators,
        authorName,
        authorBio1,
        authorBio2,
        authorPhoto,
        skills,
        courseType = 'regular',
        isActive = 1
      } = req.body;

      const result = db.prepare(`
        INSERT INTO courses (
          title, subtitle, description_1, description_2, price, old_price,
          start_date, experience, group_info, duration,
          problem_title, problem_intro1, problem_intro2, result_title, result_list, result_conclusion,
          solution_title, solution_intro, solution_how_title, solution_list, solution_conclusion,
          modules, themes, curators, author_name,
          author_bio_1, author_bio_2, author_photo, skills, course_type, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        title,
        subtitle,
        description1,
        description2,
        price,
        oldPrice,
        startDate,
        experience,
        groupInfo,
        duration,
        problemTitle,
        problemIntro1,
        problemIntro2,
        resultTitle,
        resultList,
        resultConclusion,
        solutionTitle,
        solutionIntro,
        solutionHowTitle,
        solutionList,
        solutionConclusion,
        modules,
        themes,
        curators,
        authorName,
        authorBio1,
        authorBio2,
        authorPhoto,
        skills,
        courseType,
        isActive ? 1 : 0
      );

      res.status(201).json({ 
        success: true, 
        message: 'Курс успішно створено',
        data: { id: result.lastInsertRowid }
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: 'Помилка створення курсу' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
