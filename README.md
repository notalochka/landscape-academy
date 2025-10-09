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


