import db from '../../../lib/database';
import { clearEventsCache } from '../../../lib/eventsCache';

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
        
        // Форматуємо дати як в GET /api/events
        const formatDate = (dateString) => {
          if (!dateString) return null;
          try {
            if (dateString.includes('T') || dateString.includes('Z')) {
              const date = new Date(dateString);
              return isNaN(date.getTime()) ? null : date.toISOString();
            }
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateString.trim())) {
              const date = new Date(dateString + 'T00:00:00.000Z');
              return isNaN(date.getTime()) ? null : date.toISOString();
            }
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? null : date.toISOString();
          } catch (error) {
            console.error('Error parsing date:', dateString, error);
            return null;
          }
        };
        
        const startDate = event.start_date || event.date;
        const endDate = event.end_date || event.date;
        
        // Форматуємо подію для зворотної сумісності
        const formattedEvent = {
          ...event,
          isActive: event.is_active === 1,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          createdAt: event.created_at,
          eventType: event.location && event.location !== 'Онлайн' ? 'offline' : 'online',
          telegramLink: event.telegram_link,
          time: event.time || '10:00',
          location: event.location || 'Онлайн',
          price: event.price || 'Безкоштовно'
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
        
        // Очищаємо кеш після оновлення події
        clearEventsCache();
        
        // Отримуємо оновлену подію
        const updatedEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
        
        // Форматуємо дати як в GET endpoint
        const formatDate = (dateString) => {
          if (!dateString) return null;
          try {
            if (dateString.includes('T') || dateString.includes('Z')) {
              const date = new Date(dateString);
              return isNaN(date.getTime()) ? null : date.toISOString();
            }
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateString.trim())) {
              const date = new Date(dateString + 'T00:00:00.000Z');
              return isNaN(date.getTime()) ? null : date.toISOString();
            }
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? null : date.toISOString();
          } catch (error) {
            console.error('Error parsing date:', dateString, error);
            return null;
          }
        };
        
        const startDate = updatedEvent.start_date || updatedEvent.date;
        const endDate = updatedEvent.end_date || updatedEvent.date;
        
        const formattedEvent = {
          ...updatedEvent,
          isActive: updatedEvent.is_active === 1,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          createdAt: updatedEvent.created_at,
          eventType: updatedEvent.location && updatedEvent.location !== 'Онлайн' ? 'offline' : 'online',
          time: updatedEvent.time || '10:00',
          location: updatedEvent.location || 'Онлайн',
          price: updatedEvent.price || 'Безкоштовно'
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
        
        // Перевіряємо чи є пов'язані реєстрації
        const registrations = db.prepare('SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ?').get(eventId);
        if (registrations && registrations.count > 0) {
          // Видаляємо спочатку реєстрації (або можна просто попередити)
          db.prepare('DELETE FROM event_registrations WHERE event_id = ?').run(eventId);
        }
        
        const deleteEvent = db.prepare('DELETE FROM events WHERE id = ?');
        const result = deleteEvent.run(eventId);
        
        if (result.changes === 0) {
          return res.status(404).json({ success: false, message: 'Подію не знайдено' });
        }
        
        // Очищаємо кеш після видалення події
        clearEventsCache();
        
        res.status(200).json({ success: true, message: 'Подію успішно видалено', data: existingEvent });
      } catch (error) {
        console.error('Database error:', error);
        // Більш детальна обробка помилок
        if (error.code === 'SQLITE_CONSTRAINT') {
          return res.status(409).json({ 
            success: false, 
            message: 'Неможливо видалити подію: є пов\'язані записи. Спробуйте ще раз.' 
          });
        }
        res.status(500).json({ 
          success: false, 
          message: 'Помилка видалення події',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
