import fs from 'fs';
import path from 'path';

// Збільшуємо ліміт для великих зображень
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// Шлях до JSON файлу
const eventsFilePath = path.join(process.cwd(), 'data', 'events.json');

// Функції для роботи з файлом
const readEvents = () => {
  try {
    const fileContents = fs.readFileSync(eventsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Помилка читання файлу подій:', error);
    return [];
  }
};

const writeEvents = (events) => {
  try {
    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Помилка запису файлу подій:', error);
    return false;
  }
};

export default function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  const eventId = parseInt(id);

  const events = readEvents();

  switch (method) {
    case 'GET':
      const event = events.find(e => e.id === eventId);
      
      if (!event) {
        return res.status(404).json({ success: false, message: 'Подію не знайдено' });
      }
      
      res.status(200).json({ success: true, data: event });
      break;

    case 'PUT':
      const eventIndex = events.findIndex(e => e.id === eventId);
      
      if (eventIndex === -1) {
        return res.status(404).json({ success: false, message: 'Подію не знайдено' });
      }
      
      const updatedEvent = {
        ...events[eventIndex],
        ...req.body,
        id: eventId,
        updatedAt: new Date().toISOString()
      };
      
      events[eventIndex] = updatedEvent;
      
      if (writeEvents(events)) {
        res.status(200).json({ success: true, data: updatedEvent });
      } else {
        res.status(500).json({ success: false, message: 'Помилка оновлення події' });
      }
      break;

    case 'DELETE':
      const deleteIndex = events.findIndex(e => e.id === eventId);
      
      if (deleteIndex === -1) {
        return res.status(404).json({ success: false, message: 'Подію не знайдено' });
      }
      
      const deletedEvent = events[deleteIndex];
      events.splice(deleteIndex, 1);
      
      if (writeEvents(events)) {
        res.status(200).json({ success: true, data: deletedEvent });
      } else {
        res.status(500).json({ success: false, message: 'Помилка видалення події' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
