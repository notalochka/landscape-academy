import db from '../../../lib/database';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const events = db.prepare(`
        SELECT * FROM events 
        ORDER BY created_at DESC
      `).all();
      
      res.status(200).json({ success: true, data: events });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, error: 'Помилка отримання подій' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, date, time, location, price, is_free } = req.body;
      
      const insertEvent = db.prepare(`
        INSERT INTO events (title, description, date, time, location, price, is_free)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = insertEvent.run(title, description, date, time, location, price, is_free);
      
      res.status(200).json({ 
        success: true, 
        data: { id: result.lastInsertRowid } 
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, error: 'Помилка створення події' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, title, description, date, time, location, price, is_free } = req.body;
      
      const updateEvent = db.prepare(`
        UPDATE events 
        SET title = ?, description = ?, date = ?, time = ?, 
            location = ?, price = ?, is_free = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      updateEvent.run(title, description, date, time, location, price, is_free, id);
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, error: 'Помилка оновлення події' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      
      const deleteEvent = db.prepare('DELETE FROM events WHERE id = ?');
      deleteEvent.run(id);
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, error: 'Помилка видалення події' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
