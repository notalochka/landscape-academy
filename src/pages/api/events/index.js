import db from '../../../lib/database';
import { defaultEvents } from '../../../data/defaultData';

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

  switch (method) {
    case 'GET':
      try {
        const { active } = req.query;
        
        // Check if we're in production (Vercel) and use default data
        if (process.env.NODE_ENV === 'production' && !db) {
          let events = defaultEvents;
          
          if (active === 'true') {
            events = events.filter(event => event.is_active === 1);
          }
          
          return res.status(200).json({ success: true, data: events });
        }
        
        let query = 'SELECT * FROM events';
        let params = [];
        
        if (active === 'true') {
          query += ' WHERE is_active = 1';
        }
        
        query += ' ORDER BY start_date ASC';
        
        const events = db.prepare(query).all(params);
        
        // Додаємо поля для зворотної сумісності та форматуємо дати
        const formattedEvents = events.map(event => {
          // Форматуємо дати для правильного відображення
          const formatDate = (dateString) => {
            if (!dateString) return null;
            try {
              const date = new Date(dateString);
              return date.toISOString();
            } catch (error) {
              console.error('Error parsing date:', dateString, error);
              return null;
            }
          };

          // Визначаємо дати - пріоритет start_date, потім date
          const startDate = event.start_date || event.date;
          const endDate = event.end_date || event.date;

          return {
            ...event,
            isActive: event.is_active === 1,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            createdAt: event.created_at,
            // Додаємо додаткові поля для відображення
            time: event.time || '10:00',
            location: event.location || 'Онлайн',
            price: event.price || 'Безкоштовно',
            eventType: event.location && event.location !== 'Онлайн' ? 'offline' : 'online'
          };
        }).filter(event => event.startDate); // Фільтруємо події без дат
        
        res.status(200).json({ success: true, data: formattedEvents });
      } catch (error) {
        console.error('Database error:', error);
        // Fallback to default data in case of database error
        let events = defaultEvents;
        const { active } = req.query;
        
        if (active === 'true') {
          events = events.filter(event => event.is_active === 1);
        }
        
        res.status(200).json({ success: true, data: events });
      }
      break;

    case 'POST':
      try {
        const insertEvent = db.prepare(`
          INSERT INTO events (title, description, date, start_date, end_date, time, location, price, is_free, is_active, telegram_link, image)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const result = insertEvent.run(
          req.body.title,
          req.body.description,
          req.body.startDate || req.body.date,
          req.body.startDate || req.body.date,
          req.body.endDate || req.body.startDate || req.body.date,
          req.body.time,
          req.body.location,
          req.body.price,
          req.body.isFree ? 1 : 0,
          req.body.isActive !== undefined ? (req.body.isActive ? 1 : 0) : 1,
          req.body.telegramLink || null,
          req.body.image || null
        );
        
        // Отримуємо створену подію
        const newEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);
        const formattedEvent = {
          ...newEvent,
          isActive: newEvent.is_active === 1,
          startDate: newEvent.start_date || newEvent.date,
          endDate: newEvent.end_date || newEvent.date,
          createdAt: newEvent.created_at,
          eventType: newEvent.location && newEvent.location !== 'Онлайн' ? 'offline' : 'online'
        };
        
        res.status(201).json({ success: true, data: formattedEvent });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Помилка збереження події' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}