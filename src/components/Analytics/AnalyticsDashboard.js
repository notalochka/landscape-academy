import React, { useState, useEffect } from 'react';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    topPages: [],
    userFlow: [],
    isTestData: false,
    message: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Тут буде API для отримання даних з Clarity або Google Analytics
      const response = await fetch('/api/analytics/clarity');
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Показуємо тестові дані якщо API недоступне
      setAnalytics({
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
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-analytics-loading">
        <div className="admin-analytics-loading__spinner"></div>
        <p>Завантаження аналітики...</p>
      </div>
    );
  }

  return (
    <div className="admin-analytics-dashboard">
      {/* Повідомлення про налаштування */}
      {analytics.message && (
        <div className={`admin-analytics__message ${analytics.isTestData ? 'admin-analytics__message--warning' : 'admin-analytics__message--info'}`}>
          <div className="admin-analytics__message-icon">
            {analytics.isTestData ? '⚠️' : 'ℹ️'}
          </div>
          <div className="admin-analytics__message-text">
            {analytics.message}
          </div>
        </div>
      )}

      {/* Основні метрики */}
      <div className="admin-analytics__metrics">
        <div className="admin-analytics__metric">
          <div className="admin-analytics__metric-value">{analytics.pageViews.toLocaleString()}</div>
          <div className="admin-analytics__metric-label">Перегляди сторінок</div>
        </div>
        <div className="admin-analytics__metric">
          <div className="admin-analytics__metric-value">{analytics.uniqueVisitors.toLocaleString()}</div>
          <div className="admin-analytics__metric-label">Унікальні відвідувачі</div>
        </div>
        <div className="admin-analytics__metric">
          <div className="admin-analytics__metric-value">{analytics.bounceRate}%</div>
          <div className="admin-analytics__metric-label">Показник відмов</div>
        </div>
        <div className="admin-analytics__metric">
          <div className="admin-analytics__metric-value">{analytics.avgSessionDuration}</div>
          <div className="admin-analytics__metric-label">Середня тривалість сесії</div>
        </div>
      </div>

      {/* Топ сторінки */}
      <div className="admin-analytics__section">
        <h3>Найпопулярніші сторінки</h3>
        <div className="admin-analytics__pages">
          {analytics.topPages.map((page, index) => (
            <div key={index} className="admin-analytics__page-item">
              <div className="admin-analytics__page-info">
                <div className="admin-analytics__page-title">{page.title}</div>
                <div className="admin-analytics__page-url">{page.page}</div>
              </div>
              <div className="admin-analytics__page-views">{page.views} переглядів</div>
            </div>
          ))}
        </div>
      </div>

      {/* Воронка користувачів */}
      <div className="admin-analytics__section">
        <h3>Воронка користувачів</h3>
        <div className="admin-analytics__funnel">
          {analytics.userFlow.map((step, index) => (
            <div key={index} className="admin-analytics__funnel-step">
              <div className="admin-analytics__funnel-step-info">
                <div className="admin-analytics__funnel-step-name">{step.step}</div>
                <div className="admin-analytics__funnel-step-users">{step.users} користувачів</div>
              </div>
              <div className="admin-analytics__funnel-step-bar">
                <div 
                  className="admin-analytics__funnel-step-fill"
                  style={{ width: `${(step.users / analytics.userFlow[0].users) * 100}%` }}
                ></div>
              </div>
              {index < analytics.userFlow.length - 1 && (
                <div className="admin-analytics__funnel-arrow">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Посилання на детальну аналітику */}
      <div className="admin-analytics__links">
        <a 
          href="https://clarity.microsoft.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="admin-analytics__link"
        >
          🔗 Відкрити Microsoft Clarity
        </a>
        <a 
          href="https://analytics.google.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="admin-analytics__link"
        >
          📊 Google Analytics
        </a>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
