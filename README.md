# Landscape Academy

Школа ландшафтного дизайну з сучасним веб-сайтом, побудованим на Next.js та Express.js.

## 🚀 Технології

### Frontend
- **Next.js 15.5.4** - React фреймворк з SSR для кращої SEO
- **React 19.2.0** - UI бібліотека
- **CSS Modules** - Стилізація компонентів

### Backend
- **Express.js** - Node.js веб-фреймворк
- **CORS** - Обробка cross-origin запитів
- **Nodemon** - Автоматичний перезапуск сервера

## 📁 Структура проекту

```
landscape-academy/
├── client/                 # Next.js фронтенд
│   ├── pages/             # Next.js сторінки
│   ├── src/
│   │   ├── components/    # React компоненти
│   │   │   ├── Contact/   # Форма зворотного зв'язку
│   │   │   ├── Footer/    # Підвал сайту
│   │   │   ├── Hero/      # Головна секція
│   │   │   ├── Menu/      # Навігаційне меню
│   │   │   └── Programs/  # Секція програм
│   │   ├── styles/        # Глобальні стилі
│   │   └── pages/         # Сторінки
│   └── public/            # Статичні файли
└── server/                # Express.js бекенд
    ├── controllers/       # Контролери
    ├── models/           # Моделі даних
    ├── routes/           # Маршрути API
    └── server.js         # Основний файл сервера
```

## 🛠️ Встановлення та запуск

### Передумови
- Node.js (версія 18 або новіша)
- npm або yarn

### Крок 1: Клонування репозиторію
```bash
git clone https://github.com/your-username/landscape-academy.git
cd landscape-academy
```

### Крок 2: Встановлення залежностей

**Клієнт:**
```bash
cd client
npm install
```

**Сервер:**
```bash
cd server
npm install
```

### Крок 3: Запуск проекту

**Для розробки:**

Відкрийте 2 термінали:

**Термінал 1 (Сервер):**
```bash
cd server
npm run dev
```

**Термінал 2 (Клієнт):**
```bash
cd client
npm run dev
```

**Для продакшена:**
```bash
# Збірка клієнта
cd client
npm run build
npm run export

# Запуск сервера
cd server
npm start
```

## 🌐 Адреси

- **Клієнт (Next.js):** http://localhost:4000
- **Сервер (API):** http://localhost:5000

## ✨ Особливості

- **Server-Side Rendering (SSR)** - краща SEO оптимізація
- **Адаптивний дизайн** - підтримка мобільних пристроїв
- **Плавні градієнти** - сучасний візуальний дизайн
- **Форма зворотного зв'язку** - інтегрована контактна форма
- **Оптимізовані зображення** - швидке завантаження

## 📱 Компоненти

### Contact
Форма зворотного зв'язку з полями:
- Ім'я
- Телефон
- Питання

### Hero
Головна секція з презентацією академії

### Programs
Секція з описом програм навчання

### Menu
Навігаційне меню з логотипом

### Footer
Підвал сайту з контактною інформацією

## 🚀 Деплой

Проект готовий для деплою на:
- **Vercel** (рекомендовано для Next.js)
- **Netlify**
- **Heroku**
- **DigitalOcean**

## 📄 Ліцензія

MIT License

## 👥 Автори

- [Ваше ім'я] - розробка та дизайн

## 📞 Контакти

- Email: your-email@example.com
- Телефон: +380 (XX) XXX-XX-XX
- Сайт: https://landscape-academy.com
