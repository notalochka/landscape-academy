import React, { useEffect, useState } from "react";
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
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const filtered = json.data.filter(c => c.course_type !== 'flagship');
          setCourses(filtered);
        }
      } catch (_) {}
    };
    fetchCourses();
  }, []);
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
              {courses.map(course => {
                const href = course.course_type === 'course-1'
                  ? `/course-1?id=${course.id}`
                  : course.course_type === 'course-2'
                    ? `/course-2?id=${course.id}`
                    : `/courses/${course.id}`;
                return (
                  <Link key={course.id} href={href} className="la-courses-content__course-link">
                    <div className="la-courses-content__course">
                      <h3 className="la-courses-content__course-title">{course.title}</h3>
                      <div className="la-courses-content__course-details">
                        <div className="la-courses-content__course-duration-row">
                          <div className="la-courses-content__course-arrow">
                            <span></span>
                          </div>
                          <p className="la-courses-content__course-duration">{course.duration || '—'}</p>
                        </div>
                        <p className="la-courses-content__course-date">СТАРТ: {course.start_date || '—'}</p>
                        <p className="la-courses-content__course-price">ВАРТІСТЬ: {course.price}{course.price && !/\D/.test(course.price) ? ' ГРН' : ''}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
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
