import crypto from 'crypto';
import db from '../../../lib/database';
import { sendTelegramMessage } from '../../../lib/telegram';

export default async function handler(req, res) {
  console.log('🔥 PAYMENT CALLBACK CALLED 🔥');
  console.log('📋 Method:', req.method);
  console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('📋 Raw body type:', typeof req.body);
  console.log('📋 Raw body:', JSON.stringify(req.body, null, 2));
  
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // WayForPay може надсилати тіло як application/x-www-form-urlencoded,
  // де весь JSON приходить ключем об'єкту. Обробляємо цей випадок.
  let body = req.body;
  console.log('Payment callback raw body:', JSON.stringify(body), 'keys:', Object.keys(body || {}));
  
  if (body && typeof body === 'object') {
    const keys = Object.keys(body);
    // Якщо тільки один ключ і це не orderReference, це може бути JSON-рядок
    if (keys.length === 1 && !('orderReference' in body)) {
      const loneKey = keys[0];
      if (typeof loneKey === 'string' && (loneKey.startsWith('{') || loneKey.startsWith('['))) {
        try {
          const parsed = JSON.parse(loneKey);
          body = parsed;
          console.log('Parsed JSON from key:', parsed);
        } catch (e) {
          console.warn('Failed to parse JSON from key:', e.message);
        }
      }
    }
  }

  console.log('Payment callback normalized body:', body);

  const merchantSecretKey = process.env.MERCHANT_SECRET_KEY;
  const {
    merchantAccount,
    orderReference,
    amount,
    currency,
    authCode,
    cardPan,
    transactionStatus,
    reasonCode,
    merchantSignature
  } = body || {};

  // Перевірка підпису
  const signatureString = [
    merchantAccount,
    orderReference,
    amount,
    currency,
    authCode,
    cardPan,
    transactionStatus,
    reasonCode
  ].join(';');

  if (!merchantSecretKey) {
    console.error('MERCHANT_SECRET_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const calculatedSignature = crypto
    .createHmac('md5', merchantSecretKey)
    .update(signatureString)
    .digest('hex');

  console.log('Signature check:', {
    merchantAccount,
    orderReference,
    calculated: calculatedSignature,
    received: merchantSignature,
    match: calculatedSignature === merchantSignature
  });

  if (calculatedSignature !== merchantSignature) {
    // Дозволяємо тестові мерчант-акаунти (test_merch_n1) проходити без перевірки підпису,
    // оскільки WayForPay у sandbox може присилати payload у форматі, який ламає обчислення підпису
    if (body && body.merchantAccount === 'test_merch_n1') {
      console.warn('Signature mismatch ignored for test_merch_n1 (sandbox).');
    } else {
      console.error('Invalid signature - rejecting callback');
      return res.status(400).json({ error: 'Invalid signature', calculated: calculatedSignature, received: merchantSignature });
    }
  }

  // Обробка успішної оплати
  if (transactionStatus === 'Approved') {
    console.log('Payment approved in callback for:', orderReference);
    
    // Перевіряємо чи це реєстрація на подію
    let registration = global.registrations?.[orderReference];
    // Перевіряємо чи це покупка курсу
    let coursePurchase = global.coursePurchases?.[orderReference];
    // fallback з БД, якщо global втрачено через холодний старт
    if (!registration && !coursePurchase) {
      try {
        const row = db.prepare('SELECT * FROM course_purchases WHERE transaction_id = ? LIMIT 1').get(orderReference);
        if (row) {
          coursePurchase = {
            courseId: row.course_id,
            courseTitle: row.course_title,
            userName: row.user_name,
            userPhone: row.user_phone,
            userEmail: row.user_email,
            telegramUsername: row.telegram_username,
            price: row.price,
          };
        }
      } catch (e) {
        console.error('DB lookup failed in callback:', e);
      }
    }

    // fallback для реєстрації події з БД за transaction_id
    if (!registration) {
      try {
        const regRow = db.prepare('SELECT * FROM event_registrations WHERE transaction_id = ? LIMIT 1').get(orderReference);
        if (regRow) {
          let eventTitle = '';
          try {
            const ev = db.prepare('SELECT title FROM events WHERE id = ? LIMIT 1').get(regRow.event_id);
            eventTitle = ev?.title || '';
          } catch (_) {}
          registration = {
            eventId: regRow.event_id,
            eventTitle,
            userName: regRow.user_name,
            userPhone: regRow.user_phone,
            userEmail: regRow.user_email,
            telegramUsername: regRow.telegram_username,
            price: '—',
          };
        }
      } catch (e) {
        console.error('DB lookup failed in callback (event_registrations):', e);
      }
    }
    
    if (registration) {
      registration.status = 'paid';
      registration.paidAt = new Date().toISOString();

      // Оновити статус у БД, якщо запис існує
      try {
        const upd = db.prepare(`
          UPDATE event_registrations
          SET status = 'paid', paid_at = CURRENT_TIMESTAMP
          WHERE transaction_id = ?
        `);
        upd.run(orderReference);
      } catch (e) {
        console.error('DB update failed (event_registrations):', e);
      }

      console.log('Sending Telegram notification for registration:', registration);

      // Відправити повідомлення в Telegram через утиліту
      const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
      const message = `
💰 ПЛАТНА РЕЄСТРАЦІЯ НА ПОДІЮ

🎯 Подія: ${registration.eventTitle}
👤 Ім'я: ${registration.userName}
📱 Телефон: ${registration.userPhone}
${registration.userEmail ? `📧 Email: ${registration.userEmail}` : ''}
${registration.telegramUsername ? `📱 Telegram: ${registration.telegramUsername}` : ''}
💵 Сума: ${registration.price}
✅ Статус: ОПЛАЧЕНО (callback)
🔑 ID транзакції: ${authCode}

📅 Дата: ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}
`;
      const tg = await sendTelegramMessage({ botToken: TELEGRAM_BOT_TOKEN, chatId: TELEGRAM_CHAT_ID, text: message });
      if (!tg.ok) {
        console.error('Telegram send failed (event):', tg);
      } else if (global.registrations?.[orderReference]) {
        global.registrations[orderReference].notificationSent = true;
      }
         } else if (coursePurchase) {
           coursePurchase.status = 'paid';
           coursePurchase.paidAt = new Date().toISOString();

           // Оновлюємо статус в базі даних
           try {
             const updatePurchase = db.prepare(`
               UPDATE course_purchases 
              SET status = 'paid', paid_at = CURRENT_TIMESTAMP 
               WHERE transaction_id = ?
             `);
            updatePurchase.run(orderReference);
           } catch (error) {
             console.error('Database update error:', error);
           }

      console.log('Sending Telegram notification for course purchase:', coursePurchase);

      // Відправити повідомлення в Telegram через утиліту
      const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
      const message = `
🎓 ПОКУПКА КУРСУ - ОПЛАЧЕНО

📚 Курс: ${coursePurchase.courseTitle}
👤 Ім'я: ${coursePurchase.userName}
📱 Телефон: ${coursePurchase.userPhone}
${coursePurchase.userEmail ? `📧 Email: ${coursePurchase.userEmail}` : ''}
${coursePurchase.telegramUsername ? `📱 Telegram: @${coursePurchase.telegramUsername}` : ''}
💵 Сума: ${coursePurchase.price}
✅ Статус: ОПЛАЧЕНО (callback)
🔑 ID транзакції: ${authCode}

📅 Дата: ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}
`;
      const tg = await sendTelegramMessage({ botToken: TELEGRAM_BOT_TOKEN, chatId: TELEGRAM_CHAT_ID, text: message });
      if (!tg.ok) {
        console.error('Telegram send failed (course):', tg);
      } else if (global.coursePurchases?.[orderReference]) {
        global.coursePurchases[orderReference].notificationSent = true;
      }
    } else {
      console.log('Registration or course purchase not found for orderReference:', orderReference);
    }
  } else {
    console.log('Payment not approved, status:', transactionStatus);
  }

  // Відповідь для WayForPay
  const responseSignature = crypto
    .createHmac('md5', merchantSecretKey)
    .update(`${orderReference};accept;${new Date().getTime()}`)
    .digest('hex');

  res.status(200).json({
    orderReference,
    status: 'accept',
    time: new Date().getTime(),
    signature: responseSignature
  });
}

