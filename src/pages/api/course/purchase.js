import crypto from 'crypto';
import db from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { courseId, courseTitle, price, userName, userPhone, userEmail, telegramUsername } = req.body;

  // WayForPay credentials
  const merchantAccount = process.env.MERCHANT_LOGIN;
  const merchantSecretKey = process.env.MERCHANT_SECRET_KEY;
  const merchantDomainName = process.env.NEXT_PUBLIC_SITE_URL || 'https://landscape-academy.vercel.app';

  // Генеруємо унікальний ID замовлення
  const orderReference = `COURSE_${courseId}_${Date.now()}`;
  const orderDate = Math.floor(Date.now() / 1000);
  const amount = parseFloat(price.replace(/[^\d.]/g, '')) || 0;

  // Параметри для підпису (порядок важливий!)
  const signatureString = [
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    amount,
    'UAH',
    courseTitle,
    1, // productCount
    amount // productPrice
  ].join(';');

  // Створюємо HMAC MD5 підпис
  const merchantSignature = crypto
    .createHmac('md5', merchantSecretKey)
    .update(signatureString)
    .digest('hex');

  // Параметри для WayForPay
  const wayforpayData = {
    merchantAccount,
    merchantAuthType: 'SimpleSignature',
    merchantDomainName,
    merchantSignature,
    orderReference,
    orderDate,
    amount,
    currency: 'UAH',
    productName: [courseTitle],
    productCount: [1],
    productPrice: [amount],
    clientFirstName: userName.split(' ')[0] || userName,
    clientLastName: userName.split(' ')[1] || '',
    clientEmail: userEmail || `noemail_${Date.now()}@example.com`,
    clientPhone: userPhone,
    language: 'UA',
    returnUrl: `${merchantDomainName}/payment/success?orderRef=${orderReference}&courseId=${courseId}`,
    serviceUrl: `${merchantDomainName}/api/payment/callback`,
  };

  // Зберігаємо дані покупки курсу в базу даних
  try {
    const insertPurchase = db.prepare(`
      INSERT INTO course_purchases (
        course_id, course_title, user_name, user_phone, user_email, 
        telegram_username, price, status, transaction_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertPurchase.run(
      courseId,
      courseTitle,
      userName,
      userPhone,
      userEmail || null,
      telegramUsername || null,
      price,
      'pending',
      orderReference
    );
  } catch (error) {
    console.error('Database error:', error);
  }

  // Зберігаємо дані покупки курсу для подальшої обробки (для Wayforpay callback)
  if (!global.coursePurchases) {
    global.coursePurchases = {};
  }
  
  global.coursePurchases[orderReference] = {
    courseId,
    courseTitle,
    userName,
    userPhone,
    userEmail,
    telegramUsername,
    price,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  res.status(200).json({ success: true, data: wayforpayData });
}
