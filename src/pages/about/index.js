import React from "react";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import { pagesSEO, organizationSchema } from "../../config/seo";

const AboutPage = () => {
  const aboutSEO = pagesSEO.about;

  return (
    <>
      <SEO
        title={aboutSEO.title}
        description={aboutSEO.description}
        keywords={aboutSEO.keywords}
        ogImage={aboutSEO.ogImage}
        canonical={aboutSEO.canonical}
        structuredData={organizationSchema}
      />

      {/* Header Section */}
      <Header showBanner={true} bannerTitle="ПРО АКАДЕМІЮ" />

      {/* Hero Section */}
      <section className="la-about-hero">
        <div className="la-about-hero__content">
          <h1 className="la-about-hero__title">
            <span className="la-about-hero__title-small">ПРО</span>
            <span className="la-about-hero__title-large">LANDSCAPER ACADEMY</span>
          </h1>
          <div className="la-about-hero__description">
            <p className="la-about-hero__text">
              ОСВІТНЯ ПЛАТФОРМА, ЯКА ФОРМУЄ НОВЕ ПОКОЛІННЯ ЛАНДШАФТНИХ ДИЗАЙНЕРІВ, 
              НАВЧАЮЧИ ПРАЦЮВАТИ З УКРАЇНСЬКИМ КЛІМАТОМ, ГРУНТАМИ ТА РЕАЛЬНИМИ ПОТРЕБАМИ ЛЮДЕЙ.
            </p>
            <button className="la-about-hero__cta">
              Хочу вчитися в LANDSCAPER ACADEMY
            </button>
          </div>
        </div>
      </section>

      {/* Mission and Values Section */}
      <section className="la-about-mission">
        <div className="la-about-mission__inner">
          <div className="la-about-mission__header">
            <div className="la-about-mission__logo">
              <div className="la-about-mission__logo-icon"></div>
            </div>
            <h2 className="la-about-mission__title">МІСІЯ ТА ЦІННОСТІ</h2>
          </div>
          
          <div className="la-about-mission__list">
            <div className="la-about-mission__item">
              <span className="la-about-mission__bullet"></span>
              <p>працюють за сучасними стандартами, а не за радянськими схемами;</p>
            </div>
            <div className="la-about-mission__item">
              <span className="la-about-mission__bullet"></span>
              <p>розуміють не тільки рослини, а й потреби людей;</p>
            </div>
            <div className="la-about-mission__item">
              <span className="la-about-mission__bullet"></span>
              <p>можуть пояснити клієнту логіку своїх рішень;</p>
            </div>
            <div className="la-about-mission__item">
              <span className="la-about-mission__bullet"></span>
              <p>створюють простори, що поєднують красу, функціональність і прибутковість.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="la-about-description">
        <div className="la-about-description__inner">
          <div className="la-about-description__content">
            <p className="la-about-description__text">
              <strong>LANDSCAPER Academy</strong> — це інвестиція в зелене майбутнє України.
            </p>
            <p className="la-about-description__text">
              Ми навчаємо ландшафтного дизайну українською мовою, з урахуванням клімату, 
              ґрунтів, флори та культурних традицій.
            </p>
            <p className="la-about-description__text">
              Наші курси практичні: не абстрактні схеми, а реальні кейси з досвіду роботи. 
              Програми структуровані й системні — замість випадкових порад із соцмереж.
            </p>
            <p className="la-about-description__text">
              Найцінніше — ми формуємо спільноту: дизайнерів, садівників і власників ділянок, 
              які обмінюються досвідом і знаходять партнерів по всій Україні.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <Contact />
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default AboutPage;
