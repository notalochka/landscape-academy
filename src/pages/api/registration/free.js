// API для безкоштовної реєстрації на події

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { eventId, eventTitle, userName, userPhone, userEmail, telegramLink } = req.body;

  // Створюємо запис реєстрації
  const registrationId = `FREE_${eventId}_${Date.now()}`;
  
  const registrationData = {
    id: registrationId,
    eventId,
    eventTitle,
    userName,
    userPhone,
    userEmail,
    type: 'free',
    status: 'registered',
    createdAt: new Date().toISOString()
  };

  // Зберігаємо реєстрацію
  if (!global.registrations) {
    global.registrations = {};
  }
  global.registrations[registrationId] = registrationData;

  // Відправляємо повідомлення в Telegram
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/telegram/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'event_registration_free',
        data: registrationData
      })
    });
  } catch (error) {
    console.error('Помилка відправки в Telegram:', error);
  }

  res.status(200).json({ 
    success: true, 
    data: {
      registrationId,
      telegramLink: telegramLink || null,
      message: telegramLink 
        ? 'Реєстрацію успішно завершено!' 
        : 'Реєстрацію прийнято! Наші менеджери зв\'яжуться з вами найближчим часом.'
    }
  });
}

