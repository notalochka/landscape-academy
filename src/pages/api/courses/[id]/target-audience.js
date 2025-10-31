const db = require('../../../../lib/database');

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const audienceItems = db.prepare(`
        SELECT * FROM course_target_audience 
        WHERE course_id = ? 
        ORDER BY order_index ASC
      `).all(id);
      
      res.status(200).json({ success: true, data: audienceItems });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: 'Помилка завантаження цільової аудиторії' });
    }
  } else if (req.method === 'POST') {
    try {
      const { items } = req.body;

      if (!Array.isArray(items)) {
        return res.status(400).json({ success: false, message: 'Невірний формат даних' });
      }

      db.transaction(() => {
        // Видаляємо всі існуючі пункти для цього курсу
        db.prepare('DELETE FROM course_target_audience WHERE course_id = ?').run(id);

        // Вставляємо нові пункти
        const insert = db.prepare(`
          INSERT INTO course_target_audience (course_id, order_index, text)
          VALUES (?, ?, ?)
        `);
        
        items.forEach((item, index) => {
          insert.run(id, index, item.text);
        });
      })(); // Викликаємо транзакцію

      res.status(200).json({ success: true, message: 'Цільову аудиторію успішно оновлено' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: 'Помилка збереження цільової аудиторії' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
