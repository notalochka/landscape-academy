import db from '../../../../lib/database';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Менший ліміт для часткових оновлень
    },
  },
};

export default function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { field, value } = req.body;

  console.log(`🔧 Updating course ${id}, field: ${field}`);

  // Дозволені поля для оновлення
  const allowedFields = [
    'title', 'description', 'price', 'old_price', 
    'duration', 'level', 'telegram_link', 'is_active'
  ];

  if (!allowedFields.includes(field)) {
    return res.status(400).json({ 
      success: false, 
      error: `Field '${field}' is not allowed for update` 
    });
  }

  try {
    // Оновлюємо конкретне поле
    const updateQuery = `UPDATE courses SET ${field} = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const stmt = db.prepare(updateQuery);
    const result = stmt.run(value, id);

    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Course not found' 
      });
    }

    // Отримуємо оновлений курс
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);

    console.log(`✅ Course ${id} field '${field}' updated successfully`);

    res.status(200).json({ 
      success: true, 
      data: course,
      message: `Field '${field}' updated successfully`
    });

  } catch (error) {
    console.error('❌ Error updating course field:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database error', 
      details: error.message 
    });
  }
}
