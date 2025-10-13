import React from "react";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { pagesSEO } from "../../config/seo";

const CoursesPage = () => {
  const coursesSEO = pagesSEO.courses;
  const [contentRef, contentVisible] = useScrollAnimation({ threshold: 0.1 });
  const [contactRef, contactVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <>
      <SEO
        title={coursesSEO.title}
        description={coursesSEO.description}
        keywords={coursesSEO.keywords}
        ogImage={coursesSEO.ogImage}
        canonical={coursesSEO.canonical}
      />

      {/* Header Section */}
      <Header showBanner={true} bannerTitle="КУРСИ АКАДЕМІЇ" />

      {/* Main Content */}
      <main className="la-courses-main">
        <div className="la-courses-main__inner">
          <section ref={contentRef} className={`la-courses-content animate-fade-in-up ${contentVisible ? 'is-visible' : ''}`}>
            <h1 className="la-courses-content__title">Наші курси</h1>
            <p className="la-courses-content__description">
              Landscape Academy пропонує широкий спектр курсів для різних рівнів підготовки - 
              від початківців до професіоналів.
            </p>
            
            <div className="la-courses-content__courses">
              <div className="la-courses-content__course">
                <h3>Landscaper 5.0</h3>
                <p>Перетвори хобі у бізнес. Комплексний курс для початківців.</p>
              </div>
              <div className="la-courses-content__course">
                <h3>ШІ рендер на телефоні</h3>
                <p>Від ескізу до WOW за 5 хвилин. Сучасні технології в дизайні.</p>
              </div>
              <div className="la-courses-content__course">
                <h3>Метод роботи практикуючого ландшафтного дизайнера</h3>
                <p>Або в чому секрет виходу на високий чек.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Contact Section */}
      <div ref={contactRef} className={`animate-fade-in-up ${contactVisible ? 'is-visible' : ''}`}>
        <Contact />
      </div>
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default CoursesPage;
