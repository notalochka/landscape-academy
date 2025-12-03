#!/bin/bash
# Скрипт для виправлення git pull конфлікту з базою даних

echo "🔧 Виправлення git pull конфлікту..."

# Перевіряємо чи є локальні зміни в базі даних
if git diff --quiet data/landscape_academy.db 2>/dev/null; then
    echo "✅ Немає локальних змін в базі даних"
else
    echo "⚠️ Знайдено локальні зміни в базі даних"
    echo "💾 Створюємо резервну копію..."
    cp data/landscape_academy.db data/landscape_academy.db.backup 2>/dev/null || true
fi

# Видаляємо базу даних з індексу git (якщо вона там є)
echo "🗑️ Видаляємо базу даних з git індексу..."
git rm --cached data/landscape_academy.db 2>/dev/null || true

# Stash інші зміни (якщо є)
echo "📦 Зберігаємо інші локальні зміни..."
git stash push -m "Local changes before pull" 2>/dev/null || true

# Робимо pull
echo "⬇️ Виконуємо git pull..."
git pull origin main

# Відновлюємо зміни зі stash (якщо були)
if git stash list | grep -q "Local changes before pull"; then
    echo "📤 Відновлюємо локальні зміни..."
    git stash pop 2>/dev/null || true
fi

echo "✅ Готово! База даних залишиться локальною і не буде конфліктувати з git."

