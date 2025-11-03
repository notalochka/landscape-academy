// API для відправки повідомлення про успішну оплату в Telegram

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderReference } = req.body;

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram credentials not configured');
    return res.status(500).json({ 
      success: false, 
      message: 'Telegram не налаштований' 
    });
  }

  // Спроба знайти реєстрацію події або покупку курсу
  const registration = global.registrations?.[orderReference] || null;
  const coursePurchase = global.coursePurchases?.[orderReference] || null;

  if (!registration && !coursePurchase) {
    return res.status(404).json({ 
      success: false, 
      message: 'Замовлення не знайдено' 
    });
  }

  // Уникаємо дублювання повідомлень
  if ((registration && registration.notificationSent) || (coursePurchase && coursePurchase.notificationSent)) {
    return res.status(200).json({ success: true, message: 'Повідомлення вже надіслано' });
  }

  let message;
  if (registration) {
    message = `
💰 *ПЛАТНА РЕЄСТРАЦІЯ НА ПОДІЮ*

🎯 *Подія:* ${registration.eventTitle}
👤 *Ім'я:* ${registration.userName}
📱 *Телефон:* ${registration.userPhone}
${registration.userEmail ? `📧 *Email:* ${registration.userEmail}` : ''}
💵 *Сума:* ${registration.price}
✅ *Статус:* ОПЛАЧЕНО
🔑 *Замовлення:* ${orderReference}

📅 *Дата:* ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}
`;
  } else {
    message = `
🎓 *ПОКУПКА КУРСУ - ОПЛАЧЕНО*

📚 *Курс:* ${coursePurchase.courseTitle}
👤 *Ім'я:* ${coursePurchase.userName}
📱 *Телефон:* ${coursePurchase.userPhone}
${coursePurchase.userEmail ? `📧 *Email:* ${coursePurchase.userEmail}` : ''}
${coursePurchase.telegramUsername ? `📱 *Telegram:* @${coursePurchase.telegramUsername}` : ''}
💵 *Сума:* ${coursePurchase.price}
✅ *Статус:* ОПЛАЧЕНО
🔑 *Замовлення:* ${orderReference}

📅 *Дата:* ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}
`;
  }

  try {
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    console.log('Telegram API response:', data);

    if (data.ok) {
      // Позначаємо як надіслано, оновлюємо статуси
      if (registration && global.registrations?.[orderReference]) {
        global.registrations[orderReference].status = 'paid';
        global.registrations[orderReference].notificationSent = true;
        global.registrations[orderReference].paidAt = new Date().toISOString();
      }
      if (coursePurchase && global.coursePurchases?.[orderReference]) {
        global.coursePurchases[orderReference].status = 'paid';
        global.coursePurchases[orderReference].notificationSent = true;
        global.coursePurchases[orderReference].paidAt = new Date().toISOString();
      }

      return res.status(200).json({ success: true, message: 'Повідомлення надіслано в Telegram' });
    } else {
      console.error('Telegram API error:', data);
      return res.status(500).json({ success: false, message: 'Помилка відправки в Telegram', error: data });
    }
  } catch (error) {
    console.error('Помилка відправки повідомлення:', error);
    return res.status(500).json({ success: false, message: 'Помилка відправки повідомлення', error: error.message });
  }
}

