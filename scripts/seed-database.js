const Database = require('better-sqlite3');
const path = require('path');

// Створюємо базу даних
const db = new Database(path.join(process.cwd(), 'data', 'landscape_academy.db'));

// Створюємо таблиці
const initDatabase = () => {
  // Таблиця для курсів
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price TEXT,
      old_price TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблиця для подій
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT,
      start_date TEXT,
      end_date TEXT,
      time TEXT,
      location TEXT,
      price TEXT,
      is_free BOOLEAN DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      telegram_link TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблиця для блогів
  db.exec(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      excerpt TEXT,
      author TEXT,
      featured_image TEXT,
      slug TEXT UNIQUE,
      published BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблиця для заявок на події
  db.exec(`
    CREATE TABLE IF NOT EXISTS event_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER,
      user_name TEXT NOT NULL,
      user_phone TEXT NOT NULL,
      user_email TEXT,
      telegram_username TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events (id)
    )
  `);

  // Таблиця для покупок курсів
  db.exec(`
    CREATE TABLE IF NOT EXISTS course_purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      course_title TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_phone TEXT NOT NULL,
      user_email TEXT,
      telegram_username TEXT,
      price TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      transaction_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      paid_at DATETIME,
      FOREIGN KEY (course_id) REFERENCES courses (id)
    )
  `);

  // Таблиця для контактних форм
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Заповнюємо тестовими даними
const seedDatabase = () => {
  console.log('🌱 Заповнення бази даних тестовими даними...');

  // Додаємо курси
  const insertCourse = db.prepare(`
    INSERT INTO courses (title, description, price, old_price) 
    VALUES (?, ?, ?, ?)
  `);

  insertCourse.run(
    'ШІ РЕНДЕР НА ТЕЛЕФОНІ',
    'Курс з вивчення штучного інтелекту для створення рендерів на мобільних пристроях',
    '2 500 ГРН',
    '3 000 ГРН'
  );

  insertCourse.run(
    'Метод роботи практикуючого ландшафтного дизайнера',
    'Практичний курс з ландшафтного дизайну для початківців',
    '1 500 ГРН',
    '2 000 ГРН'
  );

  insertCourse.run(
    'LANDSCAPER 5.0 - ПЕРЕТВОРИ ХОБІ У БІЗНЕС',
    'Флагманський курс ландшафтного дизайну',
    '13 900 ГРН',
    '15 000 ГРН'
  );

  // Додаємо події
  const insertEvent = db.prepare(`
    INSERT INTO events (title, description, date, start_date, end_date, time, location, price, is_free, is_active, telegram_link, image) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertEvent.run(
    'Безкоштовний вебінар "Основи ландшафтного дизайну"',
    'Вступний вебінар для початківців у сфері ландшафтного дизайну. Ви дізнаєтесь про основні принципи створення красивих садів та отримаєте практичні поради від експертів.',
    '2025-10-25',
    '2025-10-25',
    '2025-10-25',
    '19:00',
    'Онлайн',
    'Безкоштовно',
    1,
    1,
    'https://t.me/landscape_academy_webinar',
    null
  );

  insertEvent.run(
    'Мастер-клас "Створення саду мрії"',
    'Практичний мастер-клас з створення саду. Ви навчитесь планувати простір, вибирати рослини та створювати гармонійні композиції.',
    '2025-10-30',
    '2025-10-30',
    '2025-10-30',
    '15:00',
    'Київ, вул. Хрещатик 1',
    '500 ГРН',
    0,
    1,
    null,
    null
  );

  insertEvent.run(
    'Конференція "Сучасні тренди в ландшафтному дизайні"',
    'Професійна конференція для дизайнерів. Обговорення нових трендів, технологій та підходів у сучасному ландшафтному дизайні.',
    '2025-11-01',
    '2025-11-01',
    '2025-11-02',
    '15:00-20:00',
    'Любомль',
    '1 ₴',
    0,
    1,
    null,
    null
  );

  // Додаємо блоги
  const insertBlog = db.prepare(`
    INSERT INTO blogs (title, content, excerpt, author, featured_image, slug, published) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertBlog.run(
    '10 порад для початківців у ландшафтному дизайні',
    'Детальний гід з порадами для новачків у сфері ландшафтного дизайну...',
    'Основні принципи та поради для початківців',
    'Комар Микола',
    '/images/blog-1.jpg',
    '10-porad-dlya-pochatkivtsiv',
    1
  );

  insertBlog.run(
    'Сучасні тренди в ландшафтному дизайні 2024',
    'Огляд найактуальніших трендів у ландшафтному дизайні...',
    'Нові напрямки та ідеї для садів',
    'Комар Микола',
    '/images/blog-2.jpg',
    'sovremennye-trendy-2024',
    1
  );

  insertBlog.run(
    'Як створити сад мрії: покрокова інструкція',
    'Практичний гід з створення саду власноруч...',
    'Покрокова інструкція для створення саду',
    'Комар Микола',
    '/images/blog-3.jpg',
    'kak-sozdat-sad-mechty',
    1
  );

  // Додаємо тестові реєстрації на події
  const insertRegistration = db.prepare(`
    INSERT INTO event_registrations (event_id, user_name, user_phone, user_email, telegram_username, status) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertRegistration.run(1, 'Олена Петренко', '+380501234567', 'elena@example.com', '@elena_petrenko', 'registered');
  insertRegistration.run(1, 'Михайло Коваленко', '+380671234567', 'mikhail@example.com', '@mikhail_kov', 'registered');
  insertRegistration.run(2, 'Анна Сидоренко', '+380931234567', 'anna@example.com', '@anna_sid', 'registered');
  insertRegistration.run(3, 'Олексій Морозов', '+380441234567', 'alex@example.com', '@alex_moroz', 'registered');

  // Додаємо тестові покупки курсів
  const insertPurchase = db.prepare(`
    INSERT INTO course_purchases (course_id, course_title, user_name, user_phone, user_email, telegram_username, price, status, transaction_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPurchase.run(1, 'ШІ РЕНДЕР НА ТЕЛЕФОНІ', 'Вікторія Іваненко', '+380501234567', 'vika@example.com', '@vika_ivan', '2 500 ГРН', 'paid', 'TXN123456');
  insertPurchase.run(2, 'Метод роботи практикуючого ландшафтного дизайнера', 'Сергій Петров', '+380671234567', 'sergey@example.com', '@sergey_petrov', '1 500 ГРН', 'paid', 'TXN123457');
  insertPurchase.run(3, 'LANDSCAPER 5.0 - ПЕРЕТВОРИ ХОБІ У БІЗНЕС', 'Марія Козлова', '+380931234567', 'maria@example.com', '@maria_kozlova', '13 900 ГРН', 'pending', 'TXN123458');
  insertPurchase.run(1, 'ШІ РЕНДЕР НА ТЕЛЕФОНІ', 'Дмитро Семенов', '+380441234567', 'dmitry@example.com', '@dmitry_semen', '2 500 ГРН', 'paid', 'TXN123459');

  // Додаємо тестові контактні форми
  const insertContact = db.prepare(`
    INSERT INTO contact_submissions (name, email, phone, message) 
    VALUES (?, ?, ?, ?)
  `);

  insertContact.run('Наталія Кравченко', 'natalia@example.com', '+380501234567', 'Цікавлюся курсами з ландшафтного дизайну. Коли наступний набір?');
  insertContact.run('Андрій Мельник', 'andrey@example.com', '+380671234567', 'Чи можна отримати консультацію щодо створення саду?');
  insertContact.run('Ірина Бондаренко', 'irina@example.com', '+380931234567', 'Дякую за якісний курс! Рекомендую всім друзям.');

  console.log('✅ База даних успішно заповнена тестовими даними!');
};

// Ініціалізуємо та заповнюємо базу
initDatabase();
seedDatabase();

console.log('🎉 Готово! База даних створена та заповнена тестовими даними.');
console.log('📊 Статистика:');
console.log('- Курси: 3');
console.log('- Події: 3');
console.log('- Блоги: 3');
console.log('- Реєстрації на події: 4');
console.log('- Покупки курсів: 4');
console.log('- Контактні форми: 3');

db.close();
