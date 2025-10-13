// API endpoint для обробки редіректу від WayForPay
// Підтримує як GET так і POST запити

export default function handler(req, res) {
  // Підтримка GET і POST методів
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // WayForPay може передавати параметри через query (GET) або body (POST)
  const allParams = { ...req.query, ...req.body };
  const { orderReference, transactionStatus, reasonCode } = allParams;
  
  console.log('Payment return params:', allParams);
  
  // Отримуємо дані реєстрації
  const registration = global.registrations?.[orderReference];
  
  if (!registration) {
    console.log('Registration not found for orderReference:', orderReference);
    // Якщо немає даних, редірект на головну
    return res.redirect(307, '/?payment=unknown');
  }

  // Перевіряємо статус транзакції
  // WayForPay може передати: Approved, Declined, Pending, etc.
  if (transactionStatus === 'Approved') {
    // Успішна оплата
    console.log('Payment approved for:', orderReference);
    const params = new URLSearchParams({
      orderRef: orderReference,
      eventId: registration.eventId
    });
    return res.redirect(307, `/payment/success?${params.toString()}`);
  } else if (transactionStatus === 'Declined' || transactionStatus === 'Expired') {
    // Невдала оплата
    console.log('Payment declined/expired:', transactionStatus);
    const params = new URLSearchParams({
      orderRef: orderReference,
      eventId: registration.eventId,
      reason: reasonCode || 'declined'
    });
    return res.redirect(307, `/payment/failed?${params.toString()}`);
  } else {
    // Невідомий статус або оплата в процесі
    console.log('Payment status:', transactionStatus);
    // За замовчанням вважаємо успішною якщо немає явного відхилення
    const params = new URLSearchParams({
      orderRef: orderReference,
      eventId: registration.eventId
    });
    return res.redirect(307, `/payment/success?${params.toString()}`);
  }
}

