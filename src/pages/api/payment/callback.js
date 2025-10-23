import crypto from 'crypto';
import db from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Payment callback received:', req.body);

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
  } = req.body;

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

  const calculatedSignature = crypto
    .createHmac('md5', merchantSecretKey)
    .update(signatureString)
    .digest('hex');

  if (calculatedSignature !== merchantSignature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Обробка успішної оплати
  if (transactionStatus === 'Approved') {
    console.log('Payment approved in callback for:', orderReference);
    
    // Перевіряємо чи це реєстрація на подію
    const registration = global.registrations?.[orderReference];
    // Перевіряємо чи це покупка курсу
    const coursePurchase = global.coursePurchases?.[orderReference];
    
    if (registration) {
      registration.status = 'paid';
      registration.transactionId = authCode;
      registration.paidAt = new Date().toISOString();

      console.log('Sending Telegram notification for registration:', registration);

      // Відправити повідомлення в Telegram напряму
      const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        try {
          const message = `
💰 *ПЛАТНА РЕЄСТРАЦІЯ НА ПОДІЮ*

🎯 *Подія:* ${registration.eventTitle}
👤 *Ім'я:* ${registration.userName}
📱 *Телефон:* ${registration.userPhone}
${registration.userEmail ? `📧 *Email:* ${registration.userEmail}` : ''}
${registration.telegramUsername ? `📱 *Telegram:* ${registration.telegramUsername}` : ''}
💵 *Сума:* ${registration.price}
✅ *Статус:* ОПЛАЧЕНО (callback)
🔑 *ID транзакції:* ${authCode}

📅 *Дата:* ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}
`;

          const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
          
          const telegramResponse = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: message,
              parse_mode: 'Markdown',
            }),
          });

          const telegramData = await telegramResponse.json();
          console.log('Telegram notification sent:', telegramData);
        } catch (error) {
          console.error('Помилка відправки в Telegram:', error);
        }
      } else {
        console.error('Telegram credentials not configured');
      }
         } else if (coursePurchase) {
           coursePurchase.status = 'paid';
           coursePurchase.transactionId = authCode;
           coursePurchase.paidAt = new Date().toISOString();

           // Оновлюємо статус в базі даних
           try {
             const updatePurchase = db.prepare(`
               UPDATE course_purchases 
               SET status = 'paid', transaction_id = ?, paid_at = CURRENT_TIMESTAMP 
               WHERE transaction_id = ?
             `);
             updatePurchase.run(authCode, orderReference);
           } catch (error) {
             console.error('Database update error:', error);
           }

      console.log('Sending Telegram notification for course purchase:', coursePurchase);

      // Відправити повідомлення в Telegram напряму
      const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        try {
          const message = `
🎓 *ПОКУПКА КУРСУ - ОПЛАЧЕНО*

📚 *Курс:* ${coursePurchase.courseTitle}
👤 *Ім'я:* ${coursePurchase.userName}
📱 *Телефон:* ${coursePurchase.userPhone}
${coursePurchase.userEmail ? `📧 *Email:* ${coursePurchase.userEmail}` : ''}
📱 *Telegram:* @${coursePurchase.telegramUsername}
💵 *Сума:* ${coursePurchase.price}
✅ *Статус:* ОПЛАЧЕНО (callback)
🔑 *ID транзакції:* ${authCode}

📅 *Дата:* ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}
`;

          const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
          
          const telegramResponse = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: message,
              parse_mode: 'Markdown',
            }),
          });

          const telegramData = await telegramResponse.json();
          console.log('Telegram notification sent for course purchase:', telegramData);
        } catch (error) {
          console.error('Помилка відправки в Telegram для курсу:', error);
        }
      } else {
        console.error('Telegram credentials not configured');
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

