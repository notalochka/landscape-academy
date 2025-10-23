import db from '../../../lib/database';

// Збільшуємо ліміт для великих зображень
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
  const eventId = parseInt(id);

  switch (method) {
    case 'GET':
      try {
        const event = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
        
        if (!event) {
          return res.status(404).json({ success: false, message: 'Подію не знайдено' });
        }
        
        // Форматуємо подію для зворотної сумісності
        const formattedEvent = {
          ...event,
          isActive: event.is_active === 1,
          startDate: event.start_date || event.date,
          endDate: event.end_date || event.date,
          createdAt: event.created_at,
          eventType: event.location && event.location !== 'Онлайн' ? 'offline' : 'online'
        };
        
        res.status(200).json({ success: true, data: formattedEvent });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Помилка отримання події' });
      }
      break;

    case 'PUT':
      try {
        // Перевіряємо чи існує подія
        const existingEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
        
        if (!existingEvent) {
          return res.status(404).json({ success: false, message: 'Подію не знайдено' });
        }
        
        const updateEvent = db.prepare(`
          UPDATE events 
          SET title = ?, description = ?, start_date = ?, end_date = ?, 
              time = ?, location = ?, price = ?, is_active = ?, 
              telegram_link = ?, image = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        
        updateEvent.run(
          req.body.title || existingEvent.title,
          req.body.description || existingEvent.description,
          req.body.startDate || existingEvent.start_date,
          req.body.endDate || existingEvent.end_date,
          req.body.time || existingEvent.time,
          req.body.location || existingEvent.location,
          req.body.price || existingEvent.price,
          req.body.isActive !== undefined ? (req.body.isActive ? 1 : 0) : existingEvent.is_active,
          req.body.telegramLink || existingEvent.telegram_link,
          req.body.image || existingEvent.image,
          eventId
        );
        
        // Отримуємо оновлену подію
        const updatedEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
        const formattedEvent = {
          ...updatedEvent,
          isActive: updatedEvent.is_active === 1,
          startDate: updatedEvent.start_date || updatedEvent.date,
          endDate: updatedEvent.end_date || updatedEvent.date,
          createdAt: updatedEvent.created_at,
          eventType: updatedEvent.location && updatedEvent.location !== 'Онлайн' ? 'offline' : 'online'
        };
        
        res.status(200).json({ success: true, data: formattedEvent });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Помилка оновлення події' });
      }
      break;

    case 'DELETE':
      try {
        // Перевіряємо чи існує подія
        const existingEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
        
        if (!existingEvent) {
          return res.status(404).json({ success: false, message: 'Подію не знайдено' });
        }
        
        const deleteEvent = db.prepare('DELETE FROM events WHERE id = ?');
        deleteEvent.run(eventId);
        
        res.status(200).json({ success: true, data: existingEvent });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Помилка видалення події' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
