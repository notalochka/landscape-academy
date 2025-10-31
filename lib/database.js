const Database = require('better-sqlite3');
const path = require('path');

// Створюємо базу даних
const db = new Database(path.join(process.cwd(), 'data', 'landscape_academy.db'));

// Створюємо таблиці
const initDatabase = () => {
  // Універсальна таблиця для всіх курсів
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      description_1 TEXT,
      description_2 TEXT,
      price TEXT,
      old_price TEXT,
      start_date TEXT,
      experience TEXT,
      group_info TEXT,
      duration TEXT,
      problem_title TEXT,
      problem_intro1 TEXT,
      problem_intro2 TEXT,
      result_title TEXT,
      result_list TEXT,
      result_conclusion TEXT,
      solution_title TEXT,
      solution_intro TEXT,
      solution_how_title TEXT,
      solution_list TEXT,
      solution_conclusion TEXT,
      modules TEXT,
      themes TEXT,
      curators TEXT,
      author_name TEXT,
      author_bio_1 TEXT,
      author_bio_2 TEXT,
      author_photo TEXT,
      course_type TEXT DEFAULT 'regular',
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Міграції: додаємо відсутні поля до таблиці courses
  try { db.exec('ALTER TABLE courses ADD COLUMN experience TEXT'); } catch (e) {}
  try { db.exec('ALTER TABLE courses ADD COLUMN group_info TEXT'); } catch (e) {}
  try { db.exec('ALTER TABLE courses ADD COLUMN problem_title TEXT'); } catch (e) {}
  try { db.exec('ALTER TABLE courses ADD COLUMN problem_intro1 TEXT'); } catch (e) {}
  try { db.exec('ALTER TABLE courses ADD COLUMN problem_intro2 TEXT'); } catch (e) {}
  try { db.exec('ALTER TABLE courses ADD COLUMN result_title TEXT'); } catch (e) {}
  try { db.exec('ALTER TABLE courses ADD COLUMN result_list TEXT'); } catch (e) {}
  try { db.exec('ALTER TABLE courses ADD COLUMN result_conclusion TEXT'); } catch (e) {}
  try { db.exec('ALTER TABLE courses ADD COLUMN solution_title TEXT'); } catch (e) {}
  try { db.exec('ALTER TABLE courses ADD COLUMN solution_intro TEXT'); } catch (e) {}
  try { db.exec('ALTER TABLE courses ADD COLUMN solution_how_title TEXT'); } catch (e) {}
  try { db.exec('ALTER TABLE courses ADD COLUMN solution_list TEXT'); } catch (e) {}
  try { db.exec('ALTER TABLE courses ADD COLUMN solution_conclusion TEXT'); } catch (e) {}

  // Універсальна таблиця для цільової аудиторії всіх курсів
  db.exec(`
    CREATE TABLE IF NOT EXISTS course_target_audience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      order_index INTEGER NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
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

  // Таблиця для флагманського курсу
  db.exec(`
    CREATE TABLE IF NOT EXISTS flagship_course (
      id INTEGER PRIMARY KEY DEFAULT 1,
      main_title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      description_1 TEXT,
      description_2 TEXT,
      price TEXT,
      old_price TEXT,
      start_date TEXT,
      duration TEXT,
      modules TEXT,
      themes TEXT,
      curators TEXT,
      author_name TEXT,
      author_bio_1 TEXT,
      author_bio_2 TEXT,
      author_photo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблиця для цільової аудиторії курсу
  db.exec(`
    CREATE TABLE IF NOT EXISTS flagship_target_audience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER DEFAULT 1,
      order_index INTEGER NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Ініціалізуємо базу даних
initDatabase();

module.exports = db;
