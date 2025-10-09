# 🌿 Landscape Academy

Школа ландшафтного дизайну з сучасним веб-сайтом, побудованим на Next.js з вбудованим API.

## 🚀 Технології

- **Next.js 15.5.4** - React фреймворк з SSR/SSG та вбудованим API
- **React 19.2.0** - Сучасна UI бібліотека
- **Axios** - HTTP клієнт для API запитів
- **Node.js** - Backend середовище (через Next.js API Routes)
- **CSS Modules** - Модульна стилізація компонентів

## 📁 Структура проекту

```
landscape-academy/
├── public/                 # Статичні файли (доступні через /)
│   ├── assets/            # Шрифти та інші ресурси
│   │   └── fonts/         # Користувацькі шрифти
│   ├── favicon.ico        # Іконка сайту
│   ├── logo_academy.png   # Логотип академії
│   ├── manifest.json      # PWA маніфест
│   ├── robots.txt         # Налаштування для пошукових роботів
│   └── sitemap.xml        # Карта сайту для SEO
│
├── src/                   # Вихідний код додатку
│   ├── components/        # React компоненти
│   │   ├── Contact/      # Форма контактів з API інтеграцією
│   │   ├── Footer/       # Футер сайту
│   │   ├── Hero/         # Головна секція (hero section)
│   │   ├── Menu/         # Навігаційне меню
│   │   └── Programs/     # Секція з програмами навчання
│   │
│   ├── pages/            # Next.js сторінки та API routes
│   │   ├── api/          # Backend API endpoints
│   │   │   ├── contact.js    # API для контактної форми
│   │   │   └── health.js     # Health check endpoint
│   │   ├── _app.js       # Головний компонент додатку
│   │   ├── _document.js  # Налаштування HTML документа
│   │   └── index.js      # Домашня сторінка
│   │
│   └── styles/           # Стилі
│       ├── globals.css   # Глобальні стилі
│       └── fonts.css     # Шрифти проекту
│
├── .eslintrc.json        # Конфігурація ESLint
├── .gitignore            # Git ignore правила
├── jsconfig.json         # JavaScript конфігурація (шляхи)
├── next.config.js        # Конфігурація Next.js
├── package.json          # Залежності та скрипти
└── README.md             # Документація проекту
```

## 🛠️ Встановлення та запуск

### Передумови

Перед початком переконайтеся, що у вас встановлено:
- **Node.js** (версія 18 або новіша) - [Завантажити](https://nodejs.org/)
- **npm** (йде разом з Node.js) або **yarn** або **pnpm**

### Крок 1: Клонування репозиторію

```bash
git clone https://github.com/your-username/landscape-academy.git
cd landscape-academy
```

### Крок 2: Встановлення залежностей

```bash
npm install
```

або якщо використовуєте yarn:

```bash
yarn install
```

або pnpm:

```bash
pnpm install
```

### Крок 3: Запуск проекту

#### 🔧 Режим розробки (Development):

```bash
npm run dev
```

Додаток буде доступний за адресою: **http://localhost:3000**

- Frontend сторінки: `http://localhost:3000`
- API endpoints: `http://localhost:3000/api/*`
- Автоматичне перезавантаження при змінах коду (Hot Reload)

#### 🚀 Збірка для продакшену (Production):

```bash
# Створення оптимізованої збірки
npm run build

# Запуск продакшн сервера
npm start
```

#### 📦 Статичний експорт:

```bash
npm run build
npm run export
```

Це створить папку `out/` з статичними HTML файлами, які можна розмістити на будь-якому хостингу.

## 📜 Доступні скрипти

| Команда | Опис |
|---------|------|
| `npm run dev` | Запуск сервера розробки на порту 4000 |
| `npm run build` | Збірка проекту для продакшену |
| `npm start` | Запуск продакшн сервера |
| `npm run lint` | Перевірка коду з ESLint |
| `npm run export` | Експорт статичного сайту |

## 🎯 API Endpoints

Проект використовує Next.js API Routes для backend функціональності:

### `POST /api/contact`
Обробка контактної форми.

**Request body:**
```json
{
  "name": "Ім'я",
  "phone": "+380123456789",
  "question": "Текст питання"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Дякуємо! Ваша заявка успішно відправлена."
}
```

### `GET /api/health`
Перевірка статусу додатку.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-09T00:00:00.000Z",
  "service": "Landscape Academy API",
  "version": "1.0.0"
}
```

## 🎨 Особливості

- ⚡️ **Швидка продуктивність** - Next.js забезпечує оптимізовану збірку
- 🔍 **SEO оптимізація** - Server-Side Rendering для кращого індексування
- 📱 **Адаптивний дизайн** - Працює на всіх пристроях
- 🎯 **Сучасний UI** - Чистий та професійний дизайн
- ♿️ **Доступність** - Семантична розмітка та ARIA атрибути
- 🔌 **API Integration** - Вбудовані API routes для backend логіки
- 🚀 **Zero Config** - Працює "з коробки" без складних налаштувань
- 🔥 **Hot Reload** - Миттєве оновлення при розробці

## 📦 Компоненти

### Hero
Головна секція сайту з назвою академії та описом.

### Menu
Навігаційне меню з логотипом та посиланнями на основні розділи.

### Programs
Секція з описом програм навчання та курсів.

### Contact
Контактна форма для зв'язку з академією з інтеграцією API для обробки заявок.

### Footer
Футер сайту з додатковою інформацією та посиланнями.

## 🔧 Конфігурація

### jsconfig.json
Налаштовані alias-и для зручного імпорту:

```javascript
import Component from '@/components/Component';
import styles from '@/styles/styles.css';
```

### next.config.js
- React Strict Mode увімкнено
- Оптимізація зображень
- SEO налаштування

## 🚀 Розгортання (Deployment)

### Vercel (рекомендовано)
Найпростіший спосіб - розгорнути на Vercel:

1. Підключіть GitHub репозиторій
2. Vercel автоматично визначить Next.js проект
3. Натисніть "Deploy"

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Інші платформи
- **Netlify** - Підтримує Next.js
- **Railway** - Підтримує Node.js та Next.js
- **DigitalOcean** - App Platform або VPS
- **AWS** - Amplify або EC2

## 🤝 Внесок

Якщо ви хочете внести свій внесок у проект:

1. Зробіть Fork проекту
2. Створіть гілку для вашої функції (`git checkout -b feature/AmazingFeature`)
3. Зафіксуйте зміни (`git commit -m 'Add some AmazingFeature'`)
4. Відправте в гілку (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request

## 📝 Подальший розвиток

Можливі покращення:

- [ ] Інтеграція з email сервісом (SendGrid, Mailgun)
- [ ] База даних для збереження заявок (MongoDB, PostgreSQL)
- [ ] Адмін панель для управління контентом
- [ ] Система аутентифікації
- [ ] Додаткові сторінки (Курси, Блог, Про нас)
- [ ] Інтернаціоналізація (i18n)
- [ ] Progressive Web App (PWA) підтримка
- [ ] Аналітика (Google Analytics, Plausible)

## 📄 Ліцензія

Цей проект є приватним та захищений авторськими правами.

## 📧 Контакти

**Landscape Academy** - інноваційна онлайн платформа для об'єднання експертів у галузі ландшафтного дизайну для створення освітньої спільноти та підтримки розвитку зелених територій у контексті відбудови України.

---

Зроблено з 💚 для розвитку ландшафтного дизайну в Україні
