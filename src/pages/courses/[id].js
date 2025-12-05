import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import CoursePurchaseModal from "../../components/CoursePurchaseModal/CoursePurchaseModal";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { pagesSEO, courseSchema, organizationSchema } from "../../config/seo";
import { siteMetadata } from "../../config/seo";

const RegularCoursePage = ({ initialCourseData, initialAudience = [], initialCourseProgram = [] }) => {
  const router = useRouter();
  const { id } = router.query;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const [targetRef, targetVisible] = useScrollAnimation({ threshold: 0.1 });
  const [authorRef, authorVisible] = useScrollAnimation({ threshold: 0.1 });
  const [questionsRef, questionsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [programRef, programVisible] = useScrollAnimation({ threshold: 0.1 });

  const coursesSEO = pagesSEO.courses;

  const [courseData, setCourseData] = useState(initialCourseData || {
    title: "",
    subtitle: "",
    price: "",
    old_price: "",
    start_date: "",
    experience: "",
    group_info: "",
    duration: "",
    problem_title: "",
    problem_intro1: "",
    problem_intro2: "",
    result_title: "",
    result_list: "",
    result_conclusion: "",
    author_name: "",
    author_photo: "",
    author_bio_1: "",
    skills: ""
  });
  const [audience, setAudience] = useState(initialAudience);
  const [courseProgram, setCourseProgram] = useState(initialCourseProgram);

  // Оновлюємо дані клієнтсько, якщо потрібно
  useEffect(() => {
    if (!id || initialCourseData) return;
    (async () => {
      try {
        const res = await fetch(`/api/courses/${id}`);
        const json = await res.json();
        if (json.success) {
          setCourseData(prev => ({ ...prev, ...json.data }));
        }

        const ta = await fetch(`/api/courses/${id}/target-audience`).then(r => r.json());
        if (ta.success) setAudience(ta.data);

        const pr = await fetch(`/api/courses/${id}/program`).then(r => r.json());
        if (pr.success) setCourseProgram(pr.data);
      } catch (_) {}
    })();
  }, [id, initialCourseData]);

  // Групуємо програму по модулях
  const groupedModules = (() => {
    const map = {};
    courseProgram.forEach(item => {
      if (!map[item.module_number]) map[item.module_number] = { module: null, lessons: [] };
      if (item.lesson_number === null) map[item.module_number].module = item;
      else map[item.module_number].lessons.push(item);
    });
    return Object.keys(map)
      .sort((a, b) => parseFloat(a) - parseFloat(b))
      .map(k => ({ key: k, ...map[k] }));
  })();

  // Структуровані дані для курсу
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      courseSchema({
        name: courseData.title || coursesSEO.title,
        description: courseData.subtitle || courseData.description_1 || coursesSEO.description,
        price: courseData.price
      })
    ]
  };

  return (
    <>
      <SEO
        title={courseData.title ? `${courseData.title} - Landscape Academy` : coursesSEO.title}
        description={courseData.subtitle || courseData.description_1 || coursesSEO.description}
        keywords={`${courseData.title || ''}, ${coursesSEO.keywords}`}
        ogImage={courseData.author_photo || coursesSEO.ogImage}
        canonical={`/courses/${id}`}
        structuredData={structuredData}
      />

      <Header showBanner={false} />

      {/* Hero (використовуємо стилі курсу-2 для консистентності) */}
      <section className="la-course-2">
        <Link href="/courses" className="la-course-2__back-link">
          <div className="la-course-2__back-arrow"><span></span></div>
          <span>ПОВЕРНУТИСЯ НАЗАД</span>
        </Link>
        <div className="la-course-2__container">
          <div className="la-course-2__content">
            <div className="la-course-2__left">
              <p className="la-course-2__program-label">ПРОГРАМА</p>
              <h1 className="la-course-2__title">{courseData.title}</h1>
              <p className="la-course-2__subtitle">{courseData.subtitle}</p>
            </div>
            <div className="la-course-2__right">
              <div className="la-course-2__info-box">
                <div className="la-course-2__info-content">
                  <p className="la-course-2__info-item">ДОСВІД</p>
                  <p className="la-course-2__info-item-date">{courseData.experience || '—'}</p>
                  <p className="la-course-2__info-item">СТАРТ</p>
                  <p className="la-course-2__info-item-date">{courseData.start_date || '—'}</p>
                  <p className="la-course-2__info-item">ГРУПА</p>
                  <p className="la-course-2__info-item-date">{courseData.group_info || '—'}</p>
                  <p className="la-course-2__info-item">ТРИВАЛІСТЬ</p>
                  <p className="la-course-2__info-item-date">{courseData.duration || '—'}</p>
                </div>
                <button className="la-course-2__button" onClick={() => setIsPurchaseModalOpen(true)}>ЗАПИСАТИСЯ НА КУРС</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      {(courseData.problem_title || courseData.problem_intro1 || courseData.problem_intro2) && (
        <section className="la-course-2__problem">
          <div className="la-course-2__problem-container">
            {courseData.problem_title && (
              <h2 className="la-course-2__problem-title">{courseData.problem_title}</h2>
            )}
            <div className="la-course-2__problem-content">
              <div className="la-course-2__problem-left">
                <div className="la-course-2__problem-text">
                  {courseData.problem_intro1 && (<p>{courseData.problem_intro1}</p>)}
                  {courseData.problem_intro2 && (<p>{courseData.problem_intro2}</p>)}
                </div>
              </div>
              <div className="la-course-2__problem-right"><div className="la-course-2__problem-square"></div></div>
            </div>
          </div>
        </section>
      )}

      {/* Result Section */}
      {(courseData.result_title || courseData.result_list || courseData.result_conclusion) && (
        <section className="la-course-2__result">
          <div className="la-course-2__result-container">
            {courseData.result_title && (
              <h2 className="la-course-2__result-title">{courseData.result_title}</h2>
            )}
          </div>
          <div className="la-course-2__result-line"></div>
          <div className="la-course-2__result-container">
            <ul className="la-course-2__result-list">
              {(courseData.result_list || '').split(/\r?\n/).filter(Boolean).map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>
          {courseData.result_conclusion && (
            <div className="la-course-2__result-block"><p>{courseData.result_conclusion}</p></div>
          )}
        </section>
      )}

      {/* Target Audience Section */}
      {audience && audience.length > 0 && (
        <section ref={targetRef} className={`la-course-2-target animate-fade-in-up ${(targetVisible || (audience && audience.length > 0)) ? 'is-visible' : ''}`}>
          <div className="la-course-2-target__inner"><h2 className="la-course-2-target__title">ДЛЯ КОГО ЦЕЙ КУРС?</h2></div>
          <div className="la-course-2-target__line"></div>
          <div className="la-course-2-target__inner">
            <div className="la-course-2-target__content">
              <div className="la-course-2-target__list">
                {audience.map((item, index) => (
                  <div key={item.id || index} className="la-course-2-target__item">
                    <span className="la-course-2-target__number">{String(index + 1).padStart(2, '0')}</span>
                    <p className="la-course-2-target__text">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="la-course-2-target__block"></div>
            </div>
          </div>
        </section>
      )}

      {/* Author Section */}
      {(courseData.author_name || courseData.author_photo || courseData.author_bio_1) && (
        <section ref={authorRef} className={`la-course-2-author animate-fade-in-up ${(authorVisible || courseData.author_name || courseData.author_bio_1) ? 'is-visible' : ''}`}>
          <div className="la-course-2-author__inner">
            <div className="la-course-2-author__content">
              <div className="la-course-2-author__info">
                <div className="la-course-2-author__header">
                  <div className="la-course-2-author__logo">
                    <Image src="/logo_academy.png" alt="Landscape Academy" width={73} height={72} />
                  </div>
                  <span className="la-course-2-author__label">АВТОР КУРСУ</span>
                </div>
                <div className="la-course-1-author__photo-mobile">
                  <Image src={courseData.author_photo || '/methods-author-photo.png'} alt={courseData.author_name || 'Автор курсу'} width={611} height={833} className="la-course-1-author__image" />
                </div>
                <h2 className="la-course-2-author__name">{courseData.author_name}</h2>
                <div className="la-course-2__author__description">
                  <ul className="la-course-2__author__description">
                    {(courseData.author_bio_1 || '').split(/\r?\n/).filter(Boolean).map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div className="la-course-2-author__buttons">
                  <a href="#contact" className="la-course-2-author__button">ЗВ&#39;ЯЗАТИСЯ</a>
                  <a href="#la-course-2-course-program" className="la-course-2-author__button">ПРО КУРС</a>
                </div>
              </div>
            </div>
            <div className="la-course-2-author__photo">
              <Image src={courseData.author_photo || '/methods-author-photo.png'} alt={courseData.author_name || 'Автор курсу'} width={611} height={833} className="la-course-2-author__image" />
            </div>
          </div>
        </section>
      )}
      {/* Contact Questions Section */}
      <section ref={questionsRef} className={`la-course-2-contact-questions animate-fade-in-up ${questionsVisible ? 'is-visible' : ''}`}>
        <div className="la-course-2-contact-questions__inner">
          <div className="la-course-2-contact-questions__block">
            <Image src="/question_photo.png" alt="Питання" width={180} height={133} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="la-course-2-contact-questions__content">
            <h2 className="la-course-2-contact-questions__text">ВІДПОВІМО ВАМ НА ВСІ ПИТАННЯ</h2>
            <div className="la-course-2-contact-questions__buttons">
              <a href="tel:+380956301304" className="la-course-2-contact-questions__button">ЗАТЕЛЕФОНУЙТЕ НАМ</a>
              <a href="https://t.me/komarkaterinamarketing" target="_blank" rel="noopener noreferrer" className="la-course-2-contact-questions__button">НАПИСАТИ В TELEGRAM</a>
            </div>
          </div>
        </div>
      </section>

      {/* Course Program Section */}
      <section id="la-course-2-course-program" ref={programRef} className={`la-course-program animate-fade-in-up ${(programVisible || (groupedModules && groupedModules.length > 0)) ? 'is-visible' : ''}`}>
        <div className="la-course-program__inner">
          <div className="la-course-program__header">
            <div className="la-course-program__left"><p className="la-course-program__motto">{courseData.subtitle}</p></div>
            <div className="la-course-program__right"><h2 className="la-course-program__title">курс: {courseData.title}</h2></div>
          </div>
        </div>
        <div className="la-course-program__line"></div>
        <div className="la-course-program__inner">
          <div className="la-course-program__toggle">
            <h3 className="la-course-program__course-title">ПРОГРАМА КУРСУ</h3>
            <button className="la-course-program__toggle-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)} aria-label={isDropdownOpen ? 'Закрити програму' : 'Відкрити програму'}>
              <span className="la-course-program__toggle-text">ДЕТАЛЬНО</span>
              <span className={isDropdownOpen ? 'la-course-program__toggle-arrow open' : 'la-course-program__toggle-arrow'}>
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L10 10L19 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </button>
          </div>
        </div>

        {isDropdownOpen && (
          <>
            {groupedModules.map(m => (
              <React.Fragment key={m.key}>
                <div className="la-course-program__line"></div>
                <div className="la-course-program__inner">
                  <div className="la-course-program__content">
                    <div className="la-course-program__module">
                      <div className="la-course-program__module-info">
                        <h4 className="la-course-program__module-number">{m.module?.module_title || `Модуль ${m.key}`}</h4>
                        {m.module?.module_description && (
                          <h5 className="la-course-program__module-title">{m.module.module_description}</h5>
                        )}
                      </div>
                      <div className="la-course-program__lessons">
                        <ul className="la-course-program__lesson-list">
                          {m.lessons.map((lesson, li) => (
                            <li key={li} className="la-course-program__lesson">
                              <p className="la-course-program__lesson-title">
                                {lesson.lesson_title}
                              </p>
                              {lesson.lesson_description && (
                                <p className="la-course-program__lesson-description">{lesson.lesson_description}</p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </>
        )}
        <div className="la-course-program__line"></div>
      </section>

      {/* Order Section */}
      <section className="la-course-2-order">
        <div className="la-course-2-order__inner">
          <div className="la-course-2-order__content">
            <p className="la-course-2-order__text">LANDSCAPER Academy — де практичний досвід перетворюється на робочі інструменти для вашого бізнесу.</p>
          </div>
          <div className="la-course-2-order__card">
            <h2 className="la-course-2-order__title">курс: {courseData.title}</h2>
            <p className="la-course-2-order__start-date">СТАРТ: {courseData.start_date}</p>
            <div className="la-course-2-order__pricing">
              <span className="la-course-2-order__old-price">{courseData.old_price} ГРН</span>
              <span className="la-course-2-order__new-price">{courseData.price} ГРН</span>
            </div>
            <button className="la-course-2-order__button" onClick={() => setIsPurchaseModalOpen(true)}>ЗАМОВИТИ</button>
          </div>
        </div>
      </section>

      <div id="contact">
        <Contact />
      </div>
      <Footer />

      <CoursePurchaseModal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} courseData={courseData} />
    </>
  );
};

export default RegularCoursePage;

// Server-Side Rendering для SEO
export async function getServerSideProps(context) {
  const { id } = context.params;
  
  try {
    const db = require('../../lib/database');
    
    // Отримуємо курс з бази даних
    const course = db.prepare('SELECT * FROM courses WHERE id = ? AND is_active = 1').get(parseInt(id));
    
    if (!course) {
      return {
        notFound: true
      };
    }

    // Отримуємо цільову аудиторію
    const audience = db.prepare(`
      SELECT * FROM course_target_audience 
      WHERE course_id = ? 
      ORDER BY order_index ASC
    `).all(parseInt(id));

    // Отримуємо програму курсу
    const courseProgram = db.prepare(`
      SELECT * FROM course_program 
      WHERE course_id = ? 
      ORDER BY module_number ASC, lesson_number ASC
    `).all(parseInt(id));

    // Форматуємо дані курсу
    const formattedCourse = {
      ...course,
      title: course.title || '',
      subtitle: course.subtitle || course.description_1 || '',
      price: course.price || '',
      old_price: course.old_price || '',
      start_date: course.start_date || '',
      experience: course.experience || '',
      group_info: course.group_info || '',
      duration: course.duration || '',
      problem_title: course.problem_title || '',
      problem_intro1: course.problem_intro1 || '',
      problem_intro2: course.problem_intro2 || '',
      result_title: course.result_title || '',
      result_list: course.result_list || '',
      result_conclusion: course.result_conclusion || '',
      author_name: course.author_name || '',
      author_photo: course.author_photo || '',
      author_bio_1: course.author_bio_1 || '',
      description_1: course.description_1 || '',
      description_2: course.description_2 || ''
    };

    return {
      props: {
        initialCourseData: formattedCourse,
        initialAudience: audience || [],
        initialCourseProgram: courseProgram || []
      }
    };
  } catch (error) {
    console.error('Error fetching course:', error);
    return {
      notFound: true
    };
  }
}


