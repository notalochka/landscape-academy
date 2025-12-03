import db from '../../../lib/database';
import { defaultEvents } from '../../../data/defaultData';
import { getCachedEvents, setCachedEvents, clearEventsCache } from '../../../lib/eventsCache';

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
        const { active, _t } = req.query;
        
        // Якщо є параметр _t (timestamp), очищаємо кеш для цього запиту
        if (_t) {
          console.log('🔄 Cache bypass requested, clearing cache');
          clearEventsCache();
        }
        
        // Створюємо ключ кешу
        const cacheKey = `events_${active === 'true' ? 'active' : 'all'}`;
        
        // Перевіряємо кеш (тільки якщо не було запиту на очищення)
        if (!_t) {
          const cachedData = getCachedEvents(cacheKey);
          if (cachedData) {
            console.log('📦 Returning cached events data');
            res.setHeader('Cache-Control', 'public, max-age=300'); // 5 хвилин
            return res.status(200).json({ success: true, data: cachedData });
          }
        }
        
        // Check if we're in production (Vercel) and use default data
        if (process.env.NODE_ENV === 'production' && !db) {
          let events = defaultEvents;
          
          if (active === 'true') {
            events = events.filter(event => event.is_active === 1);
          }
          
          // Зберігаємо в кеш
          setCachedEvents(cacheKey, events);
          res.setHeader('Cache-Control', 'public, max-age=300');
          return res.status(200).json({ success: true, data: events });
        }
        
        let query = 'SELECT * FROM events';
        let params = [];
        
        if (active === 'true') {
          query += ' WHERE is_active = 1';
        }
        
        query += ' ORDER BY start_date ASC';
        
        console.log('🔍 Fetching events from database');
        const events = db.prepare(query).all(params);
        console.log(`📊 Знайдено ${events.length} подій в базі даних`);
        
        // Додаємо поля для зворотної сумісності та форматуємо дати
        const formattedEvents = events.map(event => {
          console.log(`  - [${event.id}] ${event.title}: start_date=${event.start_date}, end_date=${event.end_date}, is_active=${event.is_active}`);
          // Форматуємо дати для правильного відображення
          const formatDate = (dateString) => {
            if (!dateString) return null;
            try {
              // Якщо дата вже в форматі ISO, використовуємо її
              if (dateString.includes('T') || dateString.includes('Z')) {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) {
                  console.error('Invalid ISO date:', dateString);
                  return null;
                }
                return date.toISOString();
              }
              
              // Якщо дата в форматі YYYY-MM-DD, додаємо час для правильного парсингу
              const dateStr = dateString.trim();
              if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                const date = new Date(dateStr + 'T00:00:00.000Z');
                if (isNaN(date.getTime())) {
                  console.error('Invalid date format:', dateString);
                  return null;
                }
                return date.toISOString();
              }
              
              // Спробуємо парсити як є
              const date = new Date(dateString);
              if (isNaN(date.getTime())) {
                console.error('Invalid date:', dateString);
                return null;
              }
              return date.toISOString();
            } catch (error) {
              console.error('Error parsing date:', dateString, error);
              return null;
            }
          };

          // Визначаємо дати - пріоритет start_date, потім date
          const startDate = event.start_date || event.date;
          const endDate = event.end_date || event.date;

          const formattedStartDate = formatDate(startDate);
          const formattedEndDate = formatDate(endDate);

          // Пропускаємо події без валідних дат
          if (!formattedStartDate || !formattedEndDate) {
            console.warn('Skipping event with invalid dates:', {
              id: event.id,
              title: event.title,
              startDate,
              endDate
            });
            return null;
          }

          return {
            ...event,
            isActive: event.is_active === 1,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            createdAt: event.created_at,
            // Додаємо додаткові поля для відображення
            time: event.time || '10:00',
            location: event.location || 'Онлайн',
            price: event.price || 'Безкоштовно',
            eventType: event.location && event.location !== 'Онлайн' ? 'offline' : 'online'
          };
        }).filter(event => event !== null && event.startDate && event.endDate); // Фільтруємо події без дат
        
        console.log(`✅ Відформатовано ${formattedEvents.length} подій після фільтрації`);
        
        // Шукаємо цільову подію
        const targetEvent = formattedEvents.find(e => e.title && e.title.includes('Попит, рішення'));
        if (targetEvent) {
          console.log('🎯 ЦІЛЬОВА ПОДІЯ ЗНАЙДЕНА:', {
            id: targetEvent.id,
            title: targetEvent.title,
            startDate: targetEvent.startDate,
            endDate: targetEvent.endDate,
            isActive: targetEvent.isActive
          });
        } else {
          console.log('❌ ЦІЛЬОВА ПОДІЯ НЕ ЗНАЙДЕНА в відформатованих подіях!');
          console.log('Всі відформатовані події:');
          formattedEvents.forEach((e, i) => {
            console.log(`  ${i + 1}. [${e.id}] ${e.title} (${e.startDate} - ${e.endDate})`);
          });
        }
        
        // Зберігаємо в кеш
        setCachedEvents(cacheKey, formattedEvents);
        
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Вимкнути кеш
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
        
        // Очищаємо кеш після створення події
        clearEventsCache();
        
        // Отримуємо створену подію
        const newEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);
        
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
        
        const startDate = newEvent.start_date || newEvent.date;
        const endDate = newEvent.end_date || newEvent.date;
        
        const formattedEvent = {
          ...newEvent,
          isActive: newEvent.is_active === 1,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          createdAt: newEvent.created_at,
          eventType: newEvent.location && newEvent.location !== 'Онлайн' ? 'offline' : 'online',
          time: newEvent.time || '10:00',
          location: newEvent.location || 'Онлайн',
          price: newEvent.price || 'Безкоштовно'
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