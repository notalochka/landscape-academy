import db from '../../../lib/database';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Отримуємо статистику
    const coursesCount = db.prepare('SELECT COUNT(*) as count FROM courses').get().count;
    const eventsCount = db.prepare('SELECT COUNT(*) as count FROM events').get().count;
    const blogsCount = db.prepare('SELECT COUNT(*) as count FROM blogs WHERE published = 1').get().count;
    const registrationsCount = db.prepare('SELECT COUNT(*) as count FROM event_registrations').get().count;
    const purchasesCount = db.prepare('SELECT COUNT(*) as count FROM course_purchases').get().count;
    const contactSubmissionsCount = db.prepare('SELECT COUNT(*) as count FROM contact_submissions').get().count;
    
    // Загальна кількість заявок
    const totalApplications = registrationsCount + purchasesCount + contactSubmissionsCount;

    // Статистика по курсах
    const courseStats = db.prepare(`
      SELECT 
        course_title,
        COUNT(*) as purchases_count,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_count
      FROM course_purchases 
      GROUP BY course_title
    `).all();

    // Статистика по подіях
    const eventStats = db.prepare(`
      SELECT 
        e.title as event_title,
        COUNT(er.id) as registrations_count
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
      GROUP BY e.id, e.title
    `).all();

    // Останні заявки
    const recentRegistrations = db.prepare(`
      SELECT 
        'event' as type,
        er.user_name,
        er.user_phone,
        er.created_at,
        e.title as item_title
      FROM event_registrations er
      LEFT JOIN events e ON er.event_id = e.id
      ORDER BY er.created_at DESC
      LIMIT 10
    `).all();

    const recentPurchases = db.prepare(`
      SELECT 
        'course' as type,
        user_name,
        user_phone,
        created_at,
        course_title as item_title,
        status
      FROM course_purchases
      ORDER BY created_at DESC
      LIMIT 10
    `).all();

    const recentApplications = [...recentRegistrations, ...recentPurchases]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);

    // Дані для таблиць користувачів
    const coursePurchases = db.prepare(`
      SELECT 
        user_name,
        user_phone,
        course_title,
        status,
        created_at
      FROM course_purchases
      ORDER BY created_at DESC
      LIMIT 20
    `).all();

    const eventRegistrations = db.prepare(`
      SELECT 
        er.user_name,
        er.user_phone,
        e.title as event_title,
        er.status,
        er.created_at
      FROM event_registrations er
      LEFT JOIN events e ON er.event_id = e.id
      ORDER BY er.created_at DESC
      LIMIT 20
    `).all();

    res.status(200).json({
      success: true,
      data: {
        stats: {
          courses: coursesCount,
          events: eventsCount,
          blogs: blogsCount,
          applications: totalApplications
        },
        courseStats,
        eventStats,
        recentApplications,
        coursePurchases,
        eventRegistrations
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Помилка отримання статистики' 
    });
  }
}
