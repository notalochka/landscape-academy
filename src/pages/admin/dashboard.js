import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
    } else {
      setIsLoading(false);
    }
  }, [router]);

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
            <h1 className="admin-dashboard__title">Адмін панель</h1>
            <button className="admin-dashboard__logout" onClick={handleLogout}>
              Вийти
            </button>
          </div>
        </header>

        <main className="admin-dashboard__content">
          {/* Statistics */}
          <section className="admin-dashboard__stats">
            <div className="admin-stat-card">
              <h3 className="admin-stat-card__title">Курси</h3>
              <p className="admin-stat-card__value">12</p>
            </div>
            <div className="admin-stat-card">
              <h3 className="admin-stat-card__title">Події</h3>
              <p className="admin-stat-card__value">8</p>
            </div>
            <div className="admin-stat-card">
              <h3 className="admin-stat-card__title">Статті в блозі</h3>
              <p className="admin-stat-card__value">25</p>
            </div>
            <div className="admin-stat-card">
              <h3 className="admin-stat-card__title">Заявки</h3>
              <p className="admin-stat-card__value">156</p>
            </div>
          </section>

          {/* Management Sections */}
          <section className="admin-dashboard__sections">
            <div 
              className="admin-section-card"
              onClick={() => navigateToSection('courses')}
            >
              <div className="admin-section-card__icon">📚</div>
              <h3 className="admin-section-card__title">Управління курсами</h3>
              <p className="admin-section-card__description">
                Додавання, редагування та управління курсами академії
              </p>
            </div>

            <div 
              className="admin-section-card"
              onClick={() => navigateToSection('events')}
            >
              <div className="admin-section-card__icon">📅</div>
              <h3 className="admin-section-card__title">Управління подіями</h3>
              <p className="admin-section-card__description">
                Створення та редагування подій, інтеграція з календарем
              </p>
            </div>

            <div 
              className="admin-section-card"
              onClick={() => navigateToSection('flagship')}
            >
              <div className="admin-section-card__icon">⭐</div>
              <h3 className="admin-section-card__title">Флагманський курс</h3>
              <p className="admin-section-card__description">
                Редагування інформації про флагманський курс
              </p>
            </div>

            <div 
              className="admin-section-card"
              onClick={() => navigateToSection('blog')}
            >
              <div className="admin-section-card__icon">📝</div>
              <h3 className="admin-section-card__title">Управління блогом</h3>
              <p className="admin-section-card__description">
                Створення статей, SEO-налаштування
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
