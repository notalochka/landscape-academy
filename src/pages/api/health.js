// API Route для перевірки статусу додатку
// Доступний за адресою: /api/health

export default function handler(req, res) {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Landscape Academy API',
    version: '1.0.0'
  });
}

