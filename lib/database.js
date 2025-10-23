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

// Ініціалізуємо базу даних
initDatabase();

module.exports = db;
