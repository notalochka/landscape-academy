const db = require('../lib/database');

console.log('Перевірка статусу блогів у базі даних:\n');

// Отримуємо всі блоги
const blogs = db.prepare('SELECT id, title, published, slug, created_at FROM blogs ORDER BY id').all();

if (blogs.length === 0) {
  console.log('Блогів не знайдено в базі даних.');
} else {
  console.log(`Знайдено ${blogs.length} блогів:\n`);
  console.log('ID | Назва | Опубліковано | Slug | Створено');
  console.log('---|-------|--------------|------|----------');
  
  blogs.forEach(blog => {
    const published = blog.published === 1 ? '✅ Так' : '❌ Ні';
    const title = (blog.title || 'Без назви').substring(0, 40);
    const slug = blog.slug || 'немає';
    const createdAt = blog.created_at || 'немає';
    console.log(`${blog.id} | ${title} | ${published} | ${slug} | ${createdAt}`);
  });
  
  console.log('\n--- Детальна інформація про блоги 4 та 5 ---\n');
  
  const blog4 = db.prepare('SELECT * FROM blogs WHERE id = 4').get();
  const blog5 = db.prepare('SELECT * FROM blogs WHERE id = 5').get();
  
  if (blog4) {
    console.log('Блог ID 4:');
    console.log(`  Назва: ${blog4.title || 'немає'}`);
    console.log(`  Опубліковано: ${blog4.published === 1 ? '✅ Так' : '❌ Ні (published = ' + blog4.published + ')'}`);
    console.log(`  Slug: ${blog4.slug || 'немає'}`);
    console.log(`  Featured Image: ${blog4.featured_image || 'немає'}`);
    console.log(`  Tag: ${blog4.tag || 'немає'}`);
    console.log(`  Створено: ${blog4.created_at || 'немає'}`);
  } else {
    console.log('❌ Блог ID 4 не знайдено в базі даних');
  }
  
  console.log('');
  
  if (blog5) {
    console.log('Блог ID 5:');
    console.log(`  Назва: ${blog5.title || 'немає'}`);
    console.log(`  Опубліковано: ${blog5.published === 1 ? '✅ Так' : '❌ Ні (published = ' + blog5.published + ')'}`);
    console.log(`  Slug: ${blog5.slug || 'немає'}`);
    console.log(`  Featured Image: ${blog5.featured_image || 'немає'}`);
    console.log(`  Tag: ${blog5.tag || 'немає'}`);
    console.log(`  Створено: ${blog5.created_at || 'немає'}`);
  } else {
    console.log('❌ Блог ID 5 не знайдено в базі даних');
  }
}

