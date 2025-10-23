export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Перевіряємо чи налаштований Clarity ID
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
    
    if (!clarityId || clarityId === 'your-clarity-id-here') {
      // Повертаємо тестові дані якщо Clarity не налаштований
      const testData = {
        pageViews: 1247,
        uniqueVisitors: 892,
        bounceRate: 34.2,
        avgSessionDuration: '2:34',
        topPages: [
          { page: '/', views: 456, title: 'Головна сторінка' },
          { page: '/courses', views: 234, title: 'Курси' },
          { page: '/flagship', views: 189, title: 'Флагманський курс' },
          { page: '/blog', views: 156, title: 'Блог' },
          { page: '/about', views: 98, title: 'Про нас' }
        ],
        userFlow: [
          { step: 'Головна', users: 1000, dropoff: 0 },
          { step: 'Курси', users: 750, dropoff: 25 },
          { step: 'Деталі курсу', users: 450, dropoff: 40 },
          { step: 'Оплата', users: 200, dropoff: 55 },
          { step: 'Завершення', users: 180, dropoff: 10 }
        ],
        isTestData: true,
        message: 'Налаштуйте Microsoft Clarity для отримання реальних даних'
      };

      return res.status(200).json({
        success: true,
        data: testData
      });
    }

    // Тут можна додати інтеграцію з Clarity API
    // Поки що повертаємо повідомлення про налаштування
    const realData = {
      pageViews: 0,
      uniqueVisitors: 0,
      bounceRate: 0,
      avgSessionDuration: '0:00',
      topPages: [],
      userFlow: [],
      isTestData: false,
      message: 'Clarity налаштований! Дані будуть доступні через 24-48 годин після налаштування.'
    };

    res.status(200).json({
      success: true,
      data: realData
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Помилка отримання аналітики' 
    });
  }
}
