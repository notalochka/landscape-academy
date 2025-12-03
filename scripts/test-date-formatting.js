const Database = require('better-sqlite3');
const path = require('path');

// Підключаємося до бази даних
const db = new Database(path.join(process.cwd(), 'data', 'landscape_academy.db'));

console.log('🧪 Тестування форматування дат...\n');

// Отримуємо всі активні події
const events = db.prepare('SELECT * FROM events WHERE is_active = 1 ORDER BY start_date ASC').all();

console.log(`Знайдено ${events.length} активних подій\n`);

// Функція форматування дат як в API
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

events.forEach((event, index) => {
  console.log(`${index + 1}. [ID: ${event.id}] ${event.title}`);
  console.log(`   Оригінальні дати:`);
  console.log(`     date: ${event.date || 'null'}`);
  console.log(`     start_date: ${event.start_date || 'null'}`);
  console.log(`     end_date: ${event.end_date || 'null'}`);
  
  const startDate = event.start_date || event.date;
  const endDate = event.end_date || event.date;
  
  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);
  
  console.log(`   Відформатовані дати:`);
  console.log(`     startDate: ${formattedStart || 'null (ПОМИЛКА!)'}`);
  console.log(`     endDate: ${formattedEnd || 'null (ПОМИЛКА!)'}`);
  
  // Перевіряємо, чи дати валідні для JavaScript
  if (formattedStart) {
    const testDate = new Date(formattedStart);
    console.log(`     Валідність startDate: ${isNaN(testDate.getTime()) ? '❌ НЕВАЛІДНА' : '✅ Валідна'}`);
  }
  if (formattedEnd) {
    const testDate = new Date(formattedEnd);
    console.log(`     Валідність endDate: ${isNaN(testDate.getTime()) ? '❌ НЕВАЛІДНА' : '✅ Валідна'}`);
  }
  
  console.log('');
});

db.close();

