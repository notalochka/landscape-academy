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
      time TEXT,
      location TEXT,
      price TEXT,
      is_free BOOLEAN DEFAULT 0,
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
      transaction_id TEXT,
      paid_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events (id)
    )
  `);

  // Safe migration: add missing columns if the table already exists without them
  try {
    db.exec(`ALTER TABLE event_registrations ADD COLUMN transaction_id TEXT`);
  } catch (e) {
    // ignore if column exists
  }
  try {
    db.exec(`ALTER TABLE event_registrations ADD COLUMN paid_at DATETIME`);
  } catch (e) {
    // ignore if column exists
  }
  try {
    db.exec(`ALTER TABLE event_registrations ADD COLUMN notification_sent BOOLEAN DEFAULT 0`);
  } catch (e) {
    // ignore if column exists
  }

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
      notification_sent BOOLEAN DEFAULT 0,
      FOREIGN KEY (course_id) REFERENCES courses (id)
    )
  `);

  // Safe migration: add notification_sent column if it doesn't exist
  try {
    db.exec(`ALTER TABLE course_purchases ADD COLUMN notification_sent BOOLEAN DEFAULT 0`);
  } catch (e) {
    // ignore if column exists
  }

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

  // Створюємо індекси для оптимізації запитів
  try {
    // Індекси для курсів
    db.exec('CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(is_active)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_courses_type ON courses(course_type)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_courses_created ON courses(created_at)');
    
    // Індекси для подій
    db.exec('CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date)');
    
    // Індекси для блогів
    db.exec('CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_blogs_created ON blogs(created_at)');
    
    // Індекси для реєстрацій
    db.exec('CREATE INDEX IF NOT EXISTS idx_event_registrations_transaction ON event_registrations(transaction_id)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_course_purchases_transaction ON course_purchases(transaction_id)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON event_registrations(status)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_course_purchases_status ON course_purchases(status)');
    
    console.log('✅ Database indexes created successfully');
  } catch (e) {
    console.log('⚠️ Some indexes may already exist:', e.message);
  }

// Ініціалізуємо базу даних
initDatabase();

module.exports = db;
