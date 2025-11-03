import db from '../../../lib/database';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  const courseId = parseInt(id);

  switch (method) {
    case 'GET': {
      try {
        const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Курс не знайдено' });
        // Додаємо camelCase alias для зручності на фронтенді
        res.status(200).json({ success: true, data: { ...course, telegramLink: course.telegram_link } });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Помилка отримання курсу' });
      }
      break; }

    case 'PUT': {
      try {
        const existing = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
        if (!existing) return res.status(404).json({ success: false, message: 'Курс не знайдено' });
        const c = req.body || {};
        // Defensive migration for older DBs missing new columns
        try { db.exec('ALTER TABLE courses ADD COLUMN telegram_link TEXT'); } catch (e) {}
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
        const update = db.prepare(`
          UPDATE courses SET
            title = ?, subtitle = ?, description_1 = ?, description_2 = ?, price = ?, old_price = ?, start_date = ?,
            experience = ?, group_info = ?, duration = ?, problem_title = ?, problem_intro1 = ?, problem_intro2 = ?,
            result_title = ?, result_list = ?, result_conclusion = ?, solution_title = ?, solution_intro = ?,
            solution_how_title = ?, solution_list = ?, solution_conclusion = ?, modules = ?, themes = ?, curators = ?,
            author_name = ?, author_bio_1 = ?, author_bio_2 = ?, author_photo = ?, telegram_link = ?, course_type = ?, is_active = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        update.run(
          c.title ?? existing.title,
          c.subtitle ?? existing.subtitle,
          c.description1 ?? existing.description_1,
          c.description2 ?? existing.description_2,
          c.price ?? existing.price,
          c.oldPrice ?? existing.old_price,
          c.startDate ?? existing.start_date,
          c.experience ?? existing.experience,
          c.groupInfo ?? existing.group_info,
          c.duration ?? existing.duration,
          c.problemTitle ?? existing.problem_title,
          c.problemIntro1 ?? existing.problem_intro1,
          c.problemIntro2 ?? existing.problem_intro2,
          c.resultTitle ?? existing.result_title,
          c.resultList ?? existing.result_list,
          c.resultConclusion ?? existing.result_conclusion,
          c.solutionTitle ?? existing.solution_title,
          c.solutionIntro ?? existing.solution_intro,
          c.solutionHowTitle ?? existing.solution_how_title,
          c.solutionList ?? existing.solution_list,
          c.solutionConclusion ?? existing.solution_conclusion,
          c.modules ?? existing.modules,
          c.themes ?? existing.themes,
          c.curators ?? existing.curators,
          c.authorName ?? existing.author_name,
          c.authorBio1 ?? existing.author_bio_1,
          c.authorBio2 ?? existing.author_bio_2,
          c.authorPhoto ?? existing.author_photo,
          c.telegramLink ?? existing.telegram_link,
          c.courseType ?? existing.course_type,
          c.isActive !== undefined ? (c.isActive ? 1 : 0) : existing.is_active,
          courseId
        );
        const updated = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
        res.status(200).json({ success: true, data: updated });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Помилка оновлення курсу' });
      }
      break; }

    case 'DELETE': {
      try {
        const existing = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
        if (!existing) return res.status(404).json({ success: false, message: 'Курс не знайдено' });

        const tx = db.transaction(() => {
          // Видаляємо залежні записи, щоб не порушити FOREIGN KEY
          try { db.prepare('DELETE FROM course_target_audience WHERE course_id = ?').run(courseId); } catch (e) {}
          try { db.prepare('DELETE FROM course_program WHERE course_id = ?').run(courseId); } catch (e) {}
          try { db.prepare('DELETE FROM course_purchases WHERE course_id = ?').run(courseId); } catch (e) {}
        db.prepare('DELETE FROM courses WHERE id = ?').run(courseId);
        });
        tx();

        res.status(200).json({ success: true, data: existing });
      } catch (error) {
        console.error('Database error:', error);
        // Більш зрозуміле повідомлення для FOREIGN KEY помилки
        if (String(error && error.code).includes('SQLITE_CONSTRAINT')) {
          return res.status(409).json({ success: false, message: 'Неможливо видалити курс: є повʼязані записи. Спершу видаліть програму/аудиторію/покупки.' });
        }
        res.status(500).json({ success: false, message: 'Помилка видалення курсу' });
      }
      break; }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
