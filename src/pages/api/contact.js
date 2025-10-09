// API Route для обробки контактної форми
// Доступний за адресою: /api/contact

export default async function handler(req, res) {
  // Дозволяємо тільки POST запити
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { name, phone, question } = req.body;

    // Валідація даних
    if (!name || !phone || !question) {
      return res.status(400).json({ 
        success: false, 
        message: 'Всі поля обов\'язкові для заповнення' 
      });
    }

    // Тут можна додати логіку:
    // - Відправка email
    // - Збереження в базу даних
    // - Інтеграція з CRM системою
    
    console.log('Отримано нову заявку:', { name, phone, question });

    // Повертаємо успішну відповідь
    return res.status(200).json({ 
      success: true, 
      message: 'Дякуємо! Ваша заявка успішно відправлена. Ми зв\'яжемося з вами найближчим часом.' 
    });

  } catch (error) {
    console.error('Помилка обробки форми:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Виникла помилка. Спробуйте пізніше.' 
    });
  }
}

