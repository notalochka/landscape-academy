#!/usr/bin/env node
/*
  List courses summary from SQLite DB.
  Usage:
    node scripts/list-courses.js           -> prints a table summary
    node scripts/list-courses.js --json    -> prints JSON
*/
const db = require('../lib/database');

function getCounts(courseId) {
  const audience = db.prepare('SELECT COUNT(*) AS c FROM course_target_audience WHERE course_id = ?').get(courseId).c || 0;
  const modules = db.prepare('SELECT COUNT(*) AS c FROM course_program WHERE course_id = ? AND lesson_number IS NULL').get(courseId).c || 0;
  const lessons = db.prepare('SELECT COUNT(*) AS c FROM course_program WHERE course_id = ? AND lesson_number IS NOT NULL').get(courseId).c || 0;
  return { audience, modules, lessons };
}

function main() {
  const courses = db.prepare('SELECT * FROM courses ORDER BY id').all();
  const rows = courses.map(c => {
    const { audience, modules, lessons } = getCounts(c.id);
    return {
      id: c.id,
      title: c.title,
      type: c.course_type,
      active: Boolean(c.is_active),
      start_date: c.start_date,
      duration: c.duration,
      price: c.price,
      old_price: c.old_price,
      audience_count: audience,
      modules_count: modules,
      lessons_count: lessons,
      updated_at: c.updated_at,
    };
  });

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }

  console.log(`Total courses: ${rows.length}`);
  console.log('');
  rows.forEach(r => {
    console.log(`#${r.id} ${r.title}`);
    console.log(`  type: ${r.type} | active: ${r.active ? 'yes' : 'no'}`);
    console.log(`  start: ${r.start_date || '—'} | duration: ${r.duration || '—'}`);
    console.log(`  price: ${r.price || '—'} | old: ${r.old_price || '—'}`);
    console.log(`  audience: ${r.audience_count} | modules: ${r.modules_count} | lessons: ${r.lessons_count}`);
    console.log(`  updated_at: ${r.updated_at}`);
    console.log('');
  });
}

main();


