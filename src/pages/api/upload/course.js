import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'course');
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
};

function getExtension(mime) {
  const map = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
  };
  return map[mime] || '.jpg';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { image } = req.body || {};
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ success: false, message: 'Немає зображення' });
    }

    const match = image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Невірний формат (очікується base64)' });
    }

    const mime = `image/${match[1].toLowerCase()}`;
    const base64 = match[2];
    const buffer = Buffer.from(base64, 'base64');

    if (buffer.length > MAX_SIZE) {
      return res.status(400).json({ success: false, message: 'Файл більший за 5MB' });
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const ext = getExtension(mime);
    const filename = `course-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(filepath, buffer);

    const url = `/uploads/course/${filename}`;
    return res.status(200).json({ success: true, url });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ success: false, message: 'Помилка завантаження' });
  }
}
