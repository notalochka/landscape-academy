const Database = require('better-sqlite3');
const path = require('path');

// Підключаємося до бази даних
const db = new Database(path.join(process.cwd(), 'data', 'landscape_academy.db'));

console.log('🔍 Перевірка подій в базі даних...\n');

// Отримуємо всі активні події
const activeEvents = db.prepare(`
  SELECT * FROM events 
  WHERE is_active = 1 
  ORDER BY start_date ASC
`).all();

console.log(`📊 Знайдено ${activeEvents.length} активних подій:\n`);

activeEvents.forEach((event, index) => {
  console.log(`${index + 1}. [ID: ${event.id}] ${event.title}`);
  console.log(`   Дати: ${event.start_date} - ${event.end_date}`);
  console.log(`   Час: ${event.time || 'не вказано'}`);
  console.log(`   Локація: ${event.location || 'не вказано'}`);
  console.log(`   Ціна: ${event.price || 'не вказано'}`);
  console.log(`   Активна: ${event.is_active === 1 ? 'так' : 'ні'}`);
  console.log('');
});

// Перевіряємо конкретну подію
const testEvent = db.prepare(`
  SELECT * FROM events 
  WHERE title LIKE '%Попит, рішення і тренди%'
`).get();

if (testEvent) {
  console.log('✅ Тестова подія знайдена:');
  console.log(JSON.stringify(testEvent, null, 2));
  console.log('\n📅 Форматовані дати для перевірки:');
  
  // Симулюємо форматування як в API
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

  const startDate = testEvent.start_date || testEvent.date;
  const endDate = testEvent.end_date || testEvent.date;
  
  console.log(`   startDate (ISO): ${formatDate(startDate)}`);
  console.log(`   endDate (ISO): ${formatDate(endDate)}`);
  
  // Перевіряємо, чи дати в майбутньому
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventStart = new Date(startDate);
  eventStart.setHours(0, 0, 0, 0);
  
  console.log(`\n📆 Перевірка дат:`);
  console.log(`   Сьогодні: ${today.toISOString().split('T')[0]}`);
  console.log(`   Початок події: ${eventStart.toISOString().split('T')[0]}`);
  console.log(`   Подія в майбутньому: ${eventStart >= today ? '✅ так' : '❌ ні'}`);
} else {
  console.log('❌ Тестова подія не знайдена!');
}

db.close();

