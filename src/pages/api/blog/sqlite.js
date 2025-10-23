import db from '../../../lib/database';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const blogs = db.prepare(`
        SELECT * FROM blogs 
        WHERE published = 1 
        ORDER BY created_at DESC
      `).all();
      
      res.status(200).json({ success: true, data: blogs });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, error: 'Помилка отримання блогів' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, content, excerpt, author, featured_image, slug } = req.body;
      
      const insertBlog = db.prepare(`
        INSERT INTO blogs (title, content, excerpt, author, featured_image, slug, published)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = insertBlog.run(title, content, excerpt, author, featured_image, slug, 1);
      
      res.status(200).json({ 
        success: true, 
        data: { id: result.lastInsertRowid } 
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, error: 'Помилка створення блогу' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, title, content, excerpt, author, featured_image, slug, published } = req.body;
      
      const updateBlog = db.prepare(`
        UPDATE blogs 
        SET title = ?, content = ?, excerpt = ?, author = ?, 
            featured_image = ?, slug = ?, published = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      updateBlog.run(title, content, excerpt, author, featured_image, slug, published, id);
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, error: 'Помилка оновлення блогу' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      
      const deleteBlog = db.prepare('DELETE FROM blogs WHERE id = ?');
      deleteBlog.run(id);
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, error: 'Помилка видалення блогу' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
