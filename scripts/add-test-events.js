const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(process.cwd(), 'data', 'landscape_academy.db'));

const testEvents = [
  {
    title: "Воркшоп 'Створення вертикальних садів'",
    description: "Практичний воркшоп зі створення вертикальних садів та зелених стін. Ви навчитесь:\n\n• вибирати рослини для вертикальних садів\n• встановлювати систему поливу\n• доглядати за вертикальними садами\n• вирішувати типові проблеми\n\nВоркшоп включає практичну частину та матеріали.",
    start_date: "2026-01-15",
    end_date: "2026-01-15",
    time: "14:00-17:00",
    location: "Київ, вул. Хрещатик 1",
    price: "1200 грн",
    is_free: 0,
    is_active: 1,
    telegram_link: null,
    image: null
  },
  {
    title: "Онлайн-лекція 'Сучасні тренди в ландшафтному дизайні 2026'",
    description: "Огляд найактуальніших трендів у ландшафтному дизайні на 2026 рік:\n\n• екологічні рішення\n• адаптивність до клімату\n• мінімалістичні підходи\n• інтеграція технологій\n\nЛекція включає презентацію та Q&A сесію.",
    start_date: "2026-02-10",
    end_date: "2026-02-10",
    time: "19:00-21:00",
    location: "Онлайн",
    price: "500 грн",
    is_free: 0,
    is_active: 1,
    telegram_link: "https://t.me/landscape_academy",
    image: null
  },
  {
    title: "Мастер-клас 'Проєктування малих садів'",
    description: "Інтенсивний мастер-клас з проєктування малих садових просторів:\n\n• планування простору\n• вибір рослин\n• створення композицій\n• робота з кольором та текстурою\n\nМатеріали та кофе-брейк включені.",
    start_date: "2026-03-05",
    end_date: "2026-03-06",
    time: "10:00-18:00",
    location: "Львів, вул. Свободи 15",
    price: "1500 грн",
    is_free: 0,
    is_active: 1,
    telegram_link: null,
    image: null
  },
  {
    title: "Безкоштовний вебінар 'Основи догляду за садом'",
    description: "Вступний вебінар для початківців про основи догляду за садом:\n\n• сезонні роботи\n• полив та підживлення\n• обрізання рослин\n• боротьба зі шкідниками\n\nВебінар безкоштовний, реєстрація обов'язкова.",
    start_date: "2026-04-20",
    end_date: "2026-04-20",
    time: "18:00-19:30",
    location: "Онлайн",
    price: "Безкоштовно",
    is_free: 1,
    is_active: 1,
    telegram_link: "https://t.me/landscape_academy",
    image: null
  }
];

console.log('Додавання тестових подій...\n');

const insertEvent = db.prepare(`
  INSERT INTO events (title, description, date, start_date, end_date, time, location, price, is_free, is_active, telegram_link, image)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

testEvents.forEach((event, index) => {
  try {
    const result = insertEvent.run(
      event.title,
      event.description,
      event.start_date,
      event.start_date,
      event.end_date,
      event.time,
      event.location,
      event.price,
      event.is_free,
      event.is_active,
      event.telegram_link,
      event.image
    );
    console.log(`✅ Подія ${index + 1} додана (ID: ${result.lastInsertRowid}): ${event.title}`);
  } catch (error) {
    console.error(`❌ Помилка додавання події ${index + 1}:`, error.message);
  }
});

console.log('\n✅ Всі тестові події додані!');

db.close();

