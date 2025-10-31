import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import AnalyticsDashboard from "../../components/Analytics/AnalyticsDashboard";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    courses: 0,
    events: 0,
    blogs: 0,
    applications: 0
  });
  const [courseStats, setCourseStats] = useState([]);
  const [eventStats, setEventStats] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [coursePurchases, setCoursePurchases] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Check if logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
    } else {
      fetchStats();
      setIsLoading(false);
    }
  }, [router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data.stats);
        setCourseStats(data.data.courseStats);
        setEventStats(data.data.eventStats);
        setRecentApplications(data.data.recentApplications);
        setCoursePurchases(data.data.coursePurchases || []);
        setEventRegistrations(data.data.eventRegistrations || []);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin");
  };

  const navigateToSection = (section) => {
    router.push(`/admin/${section}`);
  };

  if (isLoading) {
    return (
      <div className="admin-login">
        <div className="admin-login__container">
          <p>Завантаження...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Адмін дашборд - Landscape Academy</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="admin-dashboard">
        <header className="admin-dashboard__header">
          <div className="admin-dashboard__header-inner">
            <div className="admin-dashboard__header-left">
              <div className="admin-dashboard__logo">
                <span className="admin-dashboard__logo-icon">🌱</span>
                <h1 className="admin-dashboard__title">Landscape Academy</h1>
              </div>
              <div className="admin-dashboard__breadcrumb">
                <span className="admin-dashboard__breadcrumb-item">Головна</span>
                <span className="admin-dashboard__breadcrumb-separator">›</span>
                <span className="admin-dashboard__breadcrumb-current">Дашборд</span>
              </div>
            </div>
            <div className="admin-dashboard__header-right">
              <div className="admin-dashboard__user-info">
                <div className="admin-dashboard__user-avatar">👤</div>
                <div className="admin-dashboard__user-details">
                  <span className="admin-dashboard__user-name">Адміністратор</span>
                  <span className="admin-dashboard__user-role">Головний адміністратор</span>
                </div>
              </div>
              <button className="admin-dashboard__logout" onClick={handleLogout}>
                <span className="admin-dashboard__logout-icon">🚪</span>
                Вийти
              </button>
            </div>
          </div>
        </header>

        <main className="admin-dashboard__content">
          {/* Statistics */}
          <section className="admin-dashboard__stats">
            <div className="admin-stat-card admin-stat-card--primary">
              <div className="admin-stat-card__icon">📚</div>
              <div className="admin-stat-card__content">
                <h3 className="admin-stat-card__title">Курси</h3>
                <p className="admin-stat-card__value">{stats.courses}</p>
                <span className="admin-stat-card__subtitle">Активні курси</span>
              </div>
            </div>
            <div className="admin-stat-card admin-stat-card--success">
              <div className="admin-stat-card__icon">📅</div>
              <div className="admin-stat-card__content">
                <h3 className="admin-stat-card__title">Події</h3>
                <p className="admin-stat-card__value">{stats.events}</p>
                <span className="admin-stat-card__subtitle">Заплановані події</span>
              </div>
            </div>
            <div className="admin-stat-card admin-stat-card--info">
              <div className="admin-stat-card__icon">📝</div>
              <div className="admin-stat-card__content">
                <h3 className="admin-stat-card__title">Статті в блозі</h3>
                <p className="admin-stat-card__value">{stats.blogs}</p>
                <span className="admin-stat-card__subtitle">Опубліковані статті</span>
              </div>
            </div>
            <div className="admin-stat-card admin-stat-card--warning">
              <div className="admin-stat-card__icon">📋</div>
              <div className="admin-stat-card__content">
                <h3 className="admin-stat-card__title">Заявки</h3>
                <p className="admin-stat-card__value">{stats.applications}</p>
                <span className="admin-stat-card__subtitle">Всього заявок</span>
              </div>
            </div>
          </section>

          {/* Analytics */}
          <section className="admin-dashboard__analytics">
            <div className="admin-analytics__section">
              <h3>Статистика по курсах</h3>
              <div className="admin-analytics__list">
                {courseStats.map((course, index) => (
                  <div key={index} className="admin-analytics__item">
                    <span className="admin-analytics__name">{course.course_title}</span>
                    <span className="admin-analytics__count">
                      {course.purchases_count} заявок ({course.paid_count} оплачено)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-analytics__section">
              <h3>Статистика по подіях</h3>
              <div className="admin-analytics__list">
                {eventStats.map((event, index) => (
                  <div key={index} className="admin-analytics__item">
                    <span className="admin-analytics__name">{event.event_title}</span>
                    <span className="admin-analytics__count">{event.registrations_count} реєстрацій</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-analytics__section">
              <h3>Останні заявки</h3>
              <div className="admin-analytics__list">
                {recentApplications.map((app, index) => (
                  <div key={index} className="admin-analytics__item">
                    <span className="admin-analytics__name">
                      {app.user_name} - {app.item_title}
                    </span>
                    <span className="admin-analytics__count">
                      {app.type === 'course' ? 'Курс' : 'Подія'} • {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* User Tables */}
          <section className="admin-dashboard__tables">
            <div className="admin-table">
              <div className="admin-table__header">
                <h3 className="admin-table__title">Покупки курсів</h3>
                <span className="admin-table__count">{coursePurchases.length}</span>
              </div>
              <div className="admin-table__content">
                {coursePurchases.length > 0 ? (
                  coursePurchases.map((purchase, index) => (
                    <div key={index} className="admin-table__row">
                      <div className="admin-table__cell admin-table__cell--name">
                        {purchase.user_name}
                      </div>
                      <div className="admin-table__cell admin-table__cell--contact">
                        {purchase.user_phone}
                      </div>
                      <div className="admin-table__cell admin-table__cell--contact">
                        {purchase.course_title}
                      </div>
                      <div className="admin-table__cell admin-table__cell--status">
                        <span className={`admin-table__status admin-table__status--${purchase.status}`}>
                          {purchase.status === 'paid' ? 'Оплачено' : 'Очікує'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="admin-table__empty">Немає покупок курсів</div>
                )}
              </div>
            </div>

            <div className="admin-table">
              <div className="admin-table__header">
                <h3 className="admin-table__title">Реєстрації на події</h3>
                <span className="admin-table__count">{eventRegistrations.length}</span>
              </div>
              <div className="admin-table__content">
                {eventRegistrations.length > 0 ? (
                  eventRegistrations.map((registration, index) => (
                    <div key={index} className="admin-table__row">
                      <div className="admin-table__cell admin-table__cell--name">
                        {registration.user_name}
                      </div>
                      <div className="admin-table__cell admin-table__cell--contact">
                        {registration.user_phone}
                      </div>
                      <div className="admin-table__cell admin-table__cell--contact">
                        {registration.event_title}
                      </div>
                      <div className="admin-table__cell admin-table__cell--status">
                        <span className="admin-table__status admin-table__status--registered">
                          Зареєстровано
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="admin-table__empty">Немає реєстрацій на події</div>
                )}
              </div>
            </div>
          </section>

          {/* Analytics Dashboard */}
          <section className="admin-dashboard__analytics-section">
            <AnalyticsDashboard />
          </section>

          {/* Management Sections */}
          <section className="admin-dashboard__sections">
            <div className="admin-dashboard__section-header">
              <h2 className="admin-dashboard__section-title">Управління контентом</h2>
              <p className="admin-dashboard__section-subtitle">Швидкий доступ до основних функцій</p>
            </div>
            
            <div className="admin-dashboard__management-grid">
              <div 
                className="admin-section-card admin-section-card--events"
                onClick={() => navigateToSection('events')}
              >
                <div className="admin-section-card__header">
                  <div className="admin-section-card__icon">📅</div>
                  <div className="admin-section-card__badge">Нові</div>
                </div>
                <div className="admin-section-card__content">
                  <h3 className="admin-section-card__title">Управління подіями</h3>
                  <p className="admin-section-card__description">
                    Створення та редагування подій, інтеграція з календарем
                  </p>
                  <div className="admin-section-card__stats">
                    <span className="admin-section-card__stat">
                      <strong>{stats.events}</strong> подій
                    </span>
                  </div>
                </div>
                <div className="admin-section-card__arrow">→</div>
              </div>

              <div 
                className="admin-section-card admin-section-card--blog"
                onClick={() => navigateToSection('blog')}
              >
                <div className="admin-section-card__header">
                  <div className="admin-section-card__icon">📝</div>
                  <div className="admin-section-card__badge">Популярні</div>
                </div>
                <div className="admin-section-card__content">
                  <h3 className="admin-section-card__title">Управління блогом</h3>
                  <p className="admin-section-card__description">
                    Створення статей, SEO-налаштування
                  </p>
                  <div className="admin-section-card__stats">
                    <span className="admin-section-card__stat">
                      <strong>{stats.blogs}</strong> статей
                    </span>
                  </div>
                </div>
                <div className="admin-section-card__arrow">→</div>
              </div>


              <div 
                className="admin-section-card admin-section-card--courses-universal"
                onClick={() => navigateToSection('courses')}
              >
                <div className="admin-section-card__header">
                  <div className="admin-section-card__icon">📚</div>
                  <div className="admin-section-card__badge">Універсальне</div>
                </div>
                <div className="admin-section-card__content">
                  <h3 className="admin-section-card__title">Управління курсами</h3>
                  <p className="admin-section-card__description">
                    Редагування курсів та додавання нових
                  </p>
                  <div className="admin-section-card__stats">
                    <span className="admin-section-card__stat">
                      <strong>3</strong> курси
                    </span>
                  </div>
                </div>
                <div className="admin-section-card__arrow">→</div>
              </div>


              <div 
                className="admin-section-card admin-section-card--analytics"
                onClick={() => window.open('https://clarity.microsoft.com', '_blank')}
              >
                <div className="admin-section-card__header">
                  <div className="admin-section-card__icon">📊</div>
                  <div className="admin-section-card__badge">Аналітика</div>
                </div>
                <div className="admin-section-card__content">
                  <h3 className="admin-section-card__title">Детальна аналітика</h3>
                  <p className="admin-section-card__description">
                    Хітмапи, записи сесій, теплові карти
                  </p>
                  <div className="admin-section-card__stats">
                    <span className="admin-section-card__stat">
                      Microsoft Clarity
                    </span>
                  </div>
                </div>
                <div className="admin-section-card__arrow">→</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
