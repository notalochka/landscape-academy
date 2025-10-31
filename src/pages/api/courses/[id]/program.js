const db = require('../../../../lib/database');

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
      // Отримуємо програму курсу, відсортовану за модулями та уроками
      const program = db.prepare(`
        SELECT * FROM course_program 
        WHERE course_id = ? 
        ORDER BY module_number, lesson_number, order_index
      `).all(id);

      res.status(200).json({ success: true, data: program });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: 'Помилка завантаження програми курсу' });
    }
  } else if (req.method === 'POST') {
    try {
      const { program } = req.body;

      if (!Array.isArray(program)) {
        return res.status(400).json({ success: false, message: 'Програма повинна бути масивом' });
      }

      // Спочатку видаляємо стару програму
      db.prepare('DELETE FROM course_program WHERE course_id = ?').run(id);

      // Додаємо нову програму
      const insertProgram = db.prepare(`
        INSERT INTO course_program (
          course_id, module_number, module_title, module_description, lesson_number, 
          lesson_title, lesson_description, is_practical, order_index
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      program.forEach((item, index) => {
        insertProgram.run(
          id,
          item.module_number || 1,
          item.module_title || '',
          item.module_description || null,
          item.lesson_number || null,
          item.lesson_title || null,
          item.lesson_description || null,
          item.is_practical ? 1 : 0,
          index
        );
      });

      res.status(200).json({ success: true, message: 'Програма курсу успішно збережена' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: 'Помилка збереження програми курсу' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
