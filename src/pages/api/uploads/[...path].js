import fs from 'fs';
import path from 'path';

const UPLOAD_BASE = path.join(process.cwd(), 'public', 'uploads');
const ALLOWED_DIRS = ['blog', 'course'];

const mimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const pathSegments = req.query.path;
  if (!pathSegments || !Array.isArray(pathSegments) || pathSegments.length === 0) {
    return res.status(400).json({ message: 'Bad request' });
  }

  const [dir, ...rest] = pathSegments;
  if (!dir || !ALLOWED_DIRS.includes(dir)) {
    return res.status(404).json({ message: 'Not found' });
  }

  const filename = rest.join('/');
  if (!filename || /\.\./.test(filename)) {
    return res.status(400).json({ message: 'Bad request' });
  }

  const filepath = path.join(UPLOAD_BASE, dir, ...rest);
  const allowedBase = path.join(UPLOAD_BASE, dir);
  if (!filepath.startsWith(allowedBase)) {
    return res.status(400).json({ message: 'Bad request' });
  }

  try {
    if (!fs.existsSync(filepath) || !fs.statSync(filepath).isFile()) {
      return res.status(404).json({ message: 'Not found' });
    }
    const ext = path.extname(filename).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    const stream = fs.createReadStream(filepath);
    stream.pipe(res);
  } catch (err) {
    console.error('Upload serve error:', err);
    res.status(500).json({ message: 'Error serving file' });
  }
}
