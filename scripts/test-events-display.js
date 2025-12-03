const Database = require('better-sqlite3');
const path = require('path');

// Підключаємося до бази даних
const db = new Database(path.join(process.cwd(), 'data', 'landscape_academy.db'));

console.log('🧪 Тестування відображення подій...\n');

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

// Функція toDateOnly як в компоненті
const toDateOnly = (dateLike) => {
  if (!dateLike) return null;
  try {
    const d = new Date(dateLike);
    if (isNaN(d.getTime())) {
      return null;
    }
    d.setHours(0, 0, 0, 0);
    return d;
  } catch (error) {
    return null;
  }
};

const today = new Date();
today.setHours(0, 0, 0, 0);

events.forEach((event, index) => {
  console.log(`${index + 1}. [ID: ${event.id}] ${event.title}`);
  
  const startDate = event.start_date || event.date;
  const endDate = event.end_date || event.date;
  
  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);
  
  console.log(`   Дати: ${startDate} - ${endDate}`);
  console.log(`   Відформатовані: ${formattedStart} - ${formattedEnd}`);
  
  const start = toDateOnly(formattedStart);
  const end = toDateOnly(formattedEnd);
  
  if (start && end) {
    const isUpcoming = end >= today;
    const isPast = end < today;
    const isCurrent = start <= today && end >= today;
    
    console.log(`   Статус: ${isCurrent ? '🟢 Поточна' : isUpcoming ? '🔵 Майбутня' : '🔴 Минула'}`);
    console.log(`   Діапазон: ${end.getTime() - start.getTime()} мс (${Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))} днів)`);
    
    // Перевіряємо, чи подія буде показана в календарі
    const willShowInCalendar = start !== null && end !== null;
    console.log(`   Показувати в календарі: ${willShowInCalendar ? '✅ Так' : '❌ Ні'}`);
  } else {
    console.log(`   ❌ Помилка: невалідні дати!`);
  }
  
  console.log('');
});

db.close();

