const Database = require('better-sqlite3');
const path = require('path');

// Підключаємося до бази даних
const db = new Database(path.join(process.cwd(), 'data', 'landscape_academy.db'));

console.log('🧪 Тестування API відповіді...\n');

// Симулюємо запит GET /api/events?active=true
const active = 'true';

let query = 'SELECT * FROM events';
let params = [];

if (active === 'true') {
  query += ' WHERE is_active = 1';
}

query += ' ORDER BY start_date ASC';

const events = db.prepare(query).all(params);

console.log(`Знайдено ${events.length} подій в базі\n`);

// Форматуємо як в API
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

const formattedEvents = events.map(event => {
  const startDate = event.start_date || event.date;
  const endDate = event.end_date || event.date;

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  if (!formattedStartDate || !formattedEndDate) {
    console.warn('⚠️ Пропускаємо подію з невалідними датами:', {
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
    time: event.time || '10:00',
    location: event.location || 'Онлайн',
    price: event.price || 'Безкоштовно',
    eventType: event.location && event.location !== 'Онлайн' ? 'offline' : 'online'
  };
}).filter(event => event !== null && event.startDate && event.endDate);

console.log(`✅ Відформатовано ${formattedEvents.length} подій\n`);

// Шукаємо цільову подію
const targetEvent = formattedEvents.find(e => e.title && e.title.includes('Попит, рішення'));

if (targetEvent) {
  console.log('✅ Цільова подія знайдена:');
  console.log(JSON.stringify(targetEvent, null, 2));
} else {
  console.log('❌ Цільова подія НЕ знайдена!');
  console.log('\nВсі відформатовані події:');
  formattedEvents.forEach((e, i) => {
    console.log(`  ${i + 1}. [${e.id}] ${e.title}`);
  });
}

// Симулюємо відповідь API
const apiResponse = {
  success: true,
  data: formattedEvents
};

console.log(`\n📤 API відповідь буде містити ${apiResponse.data.length} подій`);

db.close();

