# Інструкції для git pull на сервері

## Проблема
Git не може зробити pull, бо є локальні зміни в `data/landscape_academy.db`

## Рішення

Виконайте на сервері наступні команди:

### Варіант 1: Простий (рекомендований)
```bash
# Видалити базу даних з git індексу (якщо вона там є)
git rm --cached data/landscape_academy.db

# Зробити pull
git pull origin main
```

### Варіант 2: Зі збереженням локальних змін
```bash
# Створити резервну копію бази даних
cp data/landscape_academy.db data/landscape_academy.db.backup

# Видалити базу даних з git індексу
git rm --cached data/landscape_academy.db

# Зробити pull
git pull origin main

# Якщо потрібно відновити локальну базу даних:
# cp data/landscape_academy.db.backup data/landscape_academy.db
```

### Варіант 3: Використання скрипта
```bash
# Запустити скрипт автоматичного виправлення
bash scripts/git-pull-fix.sh
```

## Після pull

Переконайтеся, що база даних в `.gitignore`:
```bash
cat .gitignore | grep -E "landscape_academy.db|data/.*\.db"
```

Якщо база даних все ще відстежується git:
```bash
git rm --cached data/landscape_academy.db
git commit -m "Remove database from git tracking"
```

