// API для відправки повідомлення про успішну оплату в Telegram

import db from '../../../lib/database';
import { sendTelegramMessage } from '../../../lib/telegram';

export default async function handler(req, res) {
  console.log('🔔 NOTIFY WEBHOOK CALLED 🔔');
  console.log('📋 Method:', req.method);
  console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('📋 Body:', JSON.stringify(req.body, null, 2));
  
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderReference } = req.body;
  console.log('🎯 Notify webhook called with orderReference:', orderReference);

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
  let registration = global.registrations?.[orderReference] || null;
  let coursePurchase = global.coursePurchases?.[orderReference] || null;

  // DB fallback for course purchases (serverless cold starts may lose globals)
  if (!registration && !coursePurchase) {
    try {
      console.log('Looking up course purchase in DB for:', orderReference);
      const row = db.prepare('SELECT * FROM course_purchases WHERE transaction_id = ? LIMIT 1').get(orderReference);
      if (row) {
        console.log('Found course purchase in DB:', row);
        coursePurchase = {
          courseTitle: row.course_title,
          userName: row.user_name,
          userPhone: row.user_phone,
          userEmail: row.user_email,
          telegramUsername: row.telegram_username,
          price: row.price,
        };
      } else {
        console.log('No course purchase found in DB for:', orderReference);
      }
    } catch (e) {
      console.error('DB lookup failed for course_purchases:', e);
    }
  }

  // DB fallback for event registrations by transaction_id
  if (!registration && !coursePurchase) {
    try {
      console.log('Looking up event registration in DB for:', orderReference);
      const regRow = db.prepare('SELECT * FROM event_registrations WHERE transaction_id = ? LIMIT 1').get(orderReference);
      if (regRow) {
        console.log('Found event registration in DB:', regRow);
        let eventTitle = '';
        try {
          const ev = db.prepare('SELECT title FROM events WHERE id = ? LIMIT 1').get(regRow.event_id);
          eventTitle = ev?.title || '';
        } catch (_) {}
        registration = {
          eventTitle,
          userName: regRow.user_name,
          userPhone: regRow.user_phone,
          userEmail: regRow.user_email,
          telegramUsername: regRow.telegram_username,
          price: '—',
        };
      } else {
        console.log('No event registration found in DB for:', orderReference);
      }
    } catch (e) {
      console.error('DB lookup failed for event_registrations:', e);
    }
  }

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
    const data = await sendTelegramMessage({ botToken: TELEGRAM_BOT_TOKEN, chatId: TELEGRAM_CHAT_ID, text: message });
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

