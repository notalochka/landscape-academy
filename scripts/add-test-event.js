const Database = require('better-sqlite3');
const path = require('path');

// Підключаємося до бази даних
const db = new Database(path.join(process.cwd(), 'data', 'landscape_academy.db'));

console.log('📅 Додавання тестової події...');

const insertEvent = db.prepare(`
  INSERT INTO events (
    title, 
    description, 
    date, 
    start_date, 
    end_date, 
    time, 
    location, 
    price, 
    is_free, 
    is_active, 
    telegram_link, 
    image
  ) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const description = `Цього року ландшафтний ринок відчутно змінився — і за поведінкою клієнтів, і за тим, які рішення стали пріоритетними. Частина замовників переходить у формат "мінімум догляду", інші — у "хочу зробити вже, бо відкладати нескінченно неможливо", а деякі переглядають бюджет і шукають більш розумні сценарії замість великих концепцій.

На зустрічі зберемо все, що вплине на попит у 2026 році:

як змінились запити, що найчастіше замовляли, від яких рішень відмовлялись, які стилі стали домінувати й чому.

Поговоримо й про підготовку до нового сезону:

як ландшафтнику планувати роботу, які формати залишаться актуальними, які проєкти мають найбільший потенціал, і що варто врахувати зараз, щоб весною не починати з хаосу.

Окремий блок присвятимо трендам. Не «модним картинкам», а тому, що справді працює в реальних умовах.

Зустріч буде корисна тим, хто хоче:

• краще розуміти ринок і поведінку клієнтів

• планувати сезон, виходячи з реальних тенденцій

• підсилити свій професійний підхід 

• підготувати портфоліо та комунікації до нового сезону

Мета зустрічі — допомогти вам увійти в сезон з ясністю, а не з відчуттям «подивимось, що буде».

Запис зустрічі та чат спілкування )

Вартість 700 грн`;

try {
  const result = insertEvent.run(
    'Попит, рішення і тренди, що формують новий ландшафтний й сезон',
    description,
    '2025-12-05', // date
    '2025-12-05', // start_date
    '2025-12-06', // end_date
    '19:00-20:30', // time
    'Онлайн', // location
    '700 грн', // price
    0, // is_free (false)
    1, // is_active (true)
    'https://t.me/your_chat', // telegram_link
    null // image
  );

  console.log('✅ Подію успішно додано!');
  console.log(`   ID: ${result.lastInsertRowid}`);
  console.log(`   Назва: Попит, рішення і тренди, що формують новий ландшафтний й сезон`);
  console.log(`   Дати: 05.12.2025 - 06.12.2025`);
  console.log(`   Час: 19:00-20:30`);
  console.log(`   Ціна: 700 грн`);
  console.log(`   Активна: так`);

  // Перевіряємо, чи подія дійсно додалася
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);
  console.log('\n📋 Перевірка доданої події:');
  console.log(JSON.stringify(event, null, 2));

  // Перевіряємо всі активні події
  const activeEvents = db.prepare('SELECT id, title, start_date, end_date, is_active FROM events WHERE is_active = 1 ORDER BY start_date').all();
  console.log(`\n📊 Всього активних подій: ${activeEvents.length}`);
  activeEvents.forEach(e => {
    console.log(`   - [${e.id}] ${e.title} (${e.start_date} - ${e.end_date})`);
  });

} catch (error) {
  console.error('❌ Помилка при додаванні події:', error);
  console.error('Деталі:', error.message);
}

db.close();
console.log('\n🎉 Готово!');

