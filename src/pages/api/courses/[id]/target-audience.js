import db from '../../../../lib/database';

export default function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  const courseId = parseInt(id);

  switch (method) {
    case 'GET': {
      try {
        const rows = db.prepare('SELECT id, text, order_index FROM course_target_audience WHERE course_id = ? ORDER BY order_index ASC').all(courseId);
        res.status(200).json({ success: true, data: rows });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Помилка отримання аудиторії' });
      }
      break; }

    case 'POST': {
      try {
        const { items } = req.body || { items: [] };
        const tx = db.transaction(() => {
          db.prepare('DELETE FROM course_target_audience WHERE course_id = ?').run(courseId);
          const insert = db.prepare('INSERT INTO course_target_audience (course_id, order_index, text) VALUES (?, ?, ?)');
          items.forEach((item, idx) => {
            insert.run(courseId, idx + 1, item.text || '');
          });
        });
        tx();
        res.status(200).json({ success: true });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Помилка збереження аудиторії' });
      }
      break; }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
