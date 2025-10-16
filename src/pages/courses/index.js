import React from "react";
import Link from "next/link";
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
      <Header showBanner={false} />

      {/* Hero Section */}
      <section className="la-courses-hero">
        <div className="la-courses-hero__inner">
          <div className="la-courses-hero__left">
            <h1 className="la-courses-hero__title">КУРСИ</h1>
            <h2 className="la-courses-hero__subtitle">LANDSCAPER ACADEMY</h2>
          </div>
          <div className="la-courses-hero__right">
            <p className="la-courses-hero__description">
              РОЗВИВАЙТЕСЬ У ЛАНДШАФТНОМУ ДИЗАЙНІ — ВІД ОСНОВ ПЛАНУВАННЯ ТА БОТАНІКИ ДО СУЧАСНИХ ТЕХНОЛОГІЙ ОЗЕЛЕНЕННЯ Й СКЛАДНИХ РЕАЛЬНИХ ПРОЄКТІВ. СТАВАЙТЕ ВПЕВНЕНІШИМИ З LANDSCAPER ACADEMY.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="la-courses-main">
        <div className="la-courses-main__inner">
          <section ref={contentRef} className={`la-courses-content animate-fade-in-up ${contentVisible ? 'is-visible' : ''}`}>
            <h1 className="la-courses-content__slogan">
              ВЧИСЬ, ПРОЕКТУЙ, ВТІЛЮЙ — ОНЛАЙН З LANDSCAPER ACADEMY.
            </h1>
            
            <div className="la-courses-content__courses">
              <Link href="/course-1" className="la-courses-content__course-link">
                <div className="la-courses-content__course">
                  <h3 className="la-courses-content__course-title">ШІ РЕНДЕР НА ТЕЛЕФОНІ</h3>
                  <div className="la-courses-content__course-details">
                    <div className="la-courses-content__course-duration-row">
                      <div className="la-courses-content__course-arrow">
                        <span></span>
                      </div>
                      <p className="la-courses-content__course-duration">3 МІСЯЦІ</p>
                    </div>
                    <p className="la-courses-content__course-date">ОСІНЬ 2025</p>
                    <p className="la-courses-content__course-price">ВАРТІСТЬ: 1000 ГРН.</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/course-2" className="la-courses-content__course-link">
                <div className="la-courses-content__course">
                  <h3 className="la-courses-content__course-title">МЕТОД РОБОТИ ПРАКТИКУЮЧОГО ЛАНДШАФТНОГО ДИЗАЙНЕРА</h3>
                  <div className="la-courses-content__course-details">
                    <div className="la-courses-content__course-duration-row">
                      <div className="la-courses-content__course-arrow">
                        <span></span>
                      </div>
                      <p className="la-courses-content__course-duration">3 МІСЯЦІ</p>
                    </div>
                    <p className="la-courses-content__course-date">ОСІНЬ 2025</p>
                    <p className="la-courses-content__course-price">ВАРТІСТЬ: 1000 ГРН.</p>
                  </div>
                  
                </div>
              </Link>
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
