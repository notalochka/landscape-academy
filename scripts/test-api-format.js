const Database = require('better-sqlite3');
const path = require('path');

// Підключаємося до бази даних
const db = new Database(path.join(process.cwd(), 'data', 'landscape_academy.db'));

console.log('🧪 Симуляція API форматування подій...\n');

// Симулюємо запит GET /api/events?active=true
const active = 'true';

let query = 'SELECT * FROM events';
let params = [];

if (active === 'true') {
  query += ' WHERE is_active = 1';
}

query += ' ORDER BY start_date ASC';

const events = db.prepare(query).all(params);

// Форматуємо події як в API
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

console.log(`✅ Знайдено ${formattedEvents.length} активних подій після форматування\n`);

// Шукаємо нашу тестову подію
const testEvent = formattedEvents.find(e => e.title.includes('Попит, рішення і тренди'));

if (testEvent) {
  console.log('✅ Тестова подія знайдена в відформатованих даних:');
  console.log(`   ID: ${testEvent.id}`);
  console.log(`   Назва: ${testEvent.title}`);
  console.log(`   startDate: ${testEvent.startDate}`);
  console.log(`   endDate: ${testEvent.endDate}`);
  console.log(`   isActive: ${testEvent.isActive}`);
  console.log(`   eventType: ${testEvent.eventType}`);
  console.log(`   location: ${testEvent.location}`);
  console.log(`   time: ${testEvent.time}`);
  console.log(`   price: ${testEvent.price}`);
  
  // Перевіряємо, чи дати правильно парсяться для календаря
  const toDateOnly = (dateLike) => {
    const d = new Date(dateLike);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  
  const start = toDateOnly(testEvent.startDate);
  const end = toDateOnly(testEvent.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  console.log(`\n📅 Перевірка для календаря:`);
  console.log(`   start (Date object): ${start.toISOString()}`);
  console.log(`   end (Date object): ${end.toISOString()}`);
  console.log(`   Подія в майбутньому: ${start >= today ? '✅ так' : '❌ ні'}`);
  console.log(`   Буде показана в календарі: ${start >= today ? '✅ так' : '❌ ні'}`);
} else {
  console.log('❌ Тестова подія НЕ знайдена в відформатованих даних!');
  console.log('\nВсі відформатовані події:');
  formattedEvents.forEach((e, i) => {
    console.log(`   ${i + 1}. [${e.id}] ${e.title} (${e.startDate})`);
  });
}

db.close();

