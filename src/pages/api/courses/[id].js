const db = require('../../../lib/database');

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
      
      if (!course) {
        return res.status(404).json({ success: false, message: 'Курс не знайдено' });
      }

      res.status(200).json({ success: true, data: course });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: 'Помилка завантаження курсу' });
    }
  } else if (req.method === 'PUT') {
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
        courseType,
        isActive
      } = req.body;

      const result = db.prepare(`
        UPDATE courses
        SET title = ?, subtitle = ?, description_1 = ?, description_2 = ?, price = ?, old_price = ?,
            start_date = ?, experience = ?, group_info = ?, duration = ?,
            problem_title = ?, problem_intro1 = ?, problem_intro2 = ?, result_title = ?, result_list = ?, result_conclusion = ?,
            solution_title = ?, solution_intro = ?, solution_how_title = ?, solution_list = ?, solution_conclusion = ?,
            modules = ?, themes = ?, curators = ?,
            author_name = ?, author_bio_1 = ?, author_bio_2 = ?, author_photo = ?,
            skills = ?, course_type = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
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
        isActive ? 1 : 0,
        id
      );

      if (result.changes === 0) {
        return res.status(404).json({ success: false, message: 'Курс не знайдено' });
      }

      res.status(200).json({ success: true, message: 'Курс успішно оновлено' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: 'Помилка оновлення курсу' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Спочатку видаляємо цільову аудиторію
      db.prepare('DELETE FROM course_target_audience WHERE course_id = ?').run(id);
      
      // Потім видаляємо курс
      const result = db.prepare('DELETE FROM courses WHERE id = ?').run(id);

      if (result.changes === 0) {
        return res.status(404).json({ success: false, message: 'Курс не знайдено' });
      }

      res.status(200).json({ success: true, message: 'Курс успішно видалено' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: 'Помилка видалення курсу' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
