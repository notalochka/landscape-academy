// API для відправки повідомлень в Telegram через webhook

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, phone, question } = req.body;

  // Перевірка наявності обов'язкових полів
  if (!name || !phone) {
    return res.status(400).json({ 
      success: false, 
      message: 'Ім\'я та телефон обов\'язкові' 
    });
  }

  // Отримання даних бота з змінних середовища
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram credentials not configured');
    return res.status(500).json({ 
      success: false, 
      message: 'Telegram не налаштований. Зверніться до адміністратора.' 
    });
  }

  // Форматування повідомлення
  const message = `
🌿 *Нова заявка з Landscape Academy*

👤 *Ім'я:* ${name}
📱 *Телефон:* ${phone}
${question ? `💬 *Питання:* ${question}` : ''}

📅 *Дата:* ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}
`;

  try {
    // Відправка повідомлення в Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return res.status(200).json({ 
        success: true, 
        message: 'Заявку успішно відправлено! Ми зв\'яжемося з вами найближчим часом.' 
      });
    } else {
      console.error('Telegram API error:', data);
      return res.status(500).json({ 
        success: false, 
        message: 'Помилка при відправці. Спробуйте пізніше або зв\'яжіться з нами за телефоном.' 
      });
    }
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Помилка сервера. Спробуйте пізніше.' 
    });
  }
}
