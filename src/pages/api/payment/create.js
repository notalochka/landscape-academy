import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { eventId, eventTitle, price, userName, userPhone, userEmail } = req.body;

  // WayForPay credentials
  const merchantAccount = process.env.MERCHANT_LOGIN;
  const merchantSecretKey = process.env.MERCHANT_SECRET_KEY;
  const merchantDomainName = process.env.NEXT_PUBLIC_SITE_URL || 'https://landscapeacademy.com';

  // Генеруємо унікальний ID замовлення
  const orderReference = `EVENT_${eventId}_${Date.now()}`;
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
    eventTitle,
    1, // productCount
    amount // productPrice
  ].join(';');

  // Створюємо HMAC SHA1 підпис
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
    productName: [eventTitle],
    productCount: [1],
    productPrice: [amount],
    clientFirstName: userName.split(' ')[0] || userName,
    clientLastName: userName.split(' ')[1] || '',
    clientEmail: userEmail || `noemail_${Date.now()}@example.com`,
    clientPhone: userPhone,
    language: 'UA',
    returnUrl: `${merchantDomainName}/payment/success?orderRef=${orderReference}&eventId=${eventId}`,
    serviceUrl: `${merchantDomainName}/api/payment/callback`,
  };

  // Зберігаємо дані реєстрації для подальшої обробки
  // TODO: Зберегти в базу даних або файл
  if (!global.registrations) {
    global.registrations = {};
  }
  
  global.registrations[orderReference] = {
    eventId,
    eventTitle,
    userName,
    userPhone,
    userEmail,
    price,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  res.status(200).json({ success: true, data: wayforpayData });
}

