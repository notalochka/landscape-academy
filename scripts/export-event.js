const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Підключаємося до бази даних
const db = new Database(path.join(process.cwd(), 'data', 'landscape_academy.db'));

console.log('📤 Експорт події для імпорту на сервер...\n');

// Знаходимо нашу тестову подію
const event = db.prepare(`
  SELECT * FROM events 
  WHERE title LIKE '%Попит, рішення і тренди%'
`).get();

if (!event) {
  console.log('❌ Подію не знайдено!');
  process.exit(1);
}

// Форматуємо подію для API запиту
const eventData = {
  title: event.title,
  description: event.description,
  startDate: event.start_date || event.date,
  endDate: event.end_date || event.start_date || event.date,
  time: event.time,
  location: event.location,
  price: event.price,
  eventType: event.location && event.location !== 'Онлайн' ? 'offline' : 'online',
  telegramLink: event.telegram_link || null,
  image: event.image || null,
  isActive: event.is_active === 1
};

// Зберігаємо в JSON файл
const exportFile = path.join(process.cwd(), 'scripts', 'event-export.json');
fs.writeFileSync(exportFile, JSON.stringify(eventData, null, 2), 'utf8');

console.log('✅ Подію експортовано!');
console.log(`\n📄 Файл: ${exportFile}`);
console.log('\n📋 Дані події:');
console.log(JSON.stringify(eventData, null, 2));

console.log('\n💡 Для додавання на сервер:');
console.log('1. Відкрийте адмін-панель на сервері: /admin/events');
console.log('2. Натисніть "Додати нову подію"');
console.log('3. Заповніть форму з даними вище');
console.log('\nАбо використайте curl команду (замініть URL на ваш сервер):');
console.log(`curl -X POST https://your-server.com/api/events \\`);
console.log(`  -H "Content-Type: application/json" \\`);
console.log(`  -d '${JSON.stringify(eventData)}'`);

db.close();

