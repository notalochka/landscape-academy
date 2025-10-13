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

  switch (method) {
    case 'GET':
      const events = readEvents();
      const { active } = req.query;
      let filteredEvents = [...events];
      
      if (active === 'true') {
        filteredEvents = filteredEvents.filter(event => event.isActive);
      }
      
      // Сортування за датою початку
      filteredEvents = filteredEvents.sort((a, b) => 
        new Date(a.startDate) - new Date(b.startDate)
      );
      
      res.status(200).json({ success: true, data: filteredEvents });
      break;

    case 'POST':
      const allEvents = readEvents();
      
      const newEvent = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
      };
      
      allEvents.push(newEvent);
      
      if (writeEvents(allEvents)) {
        res.status(201).json({ success: true, data: newEvent });
      } else {
        res.status(500).json({ success: false, message: 'Помилка збереження події' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
