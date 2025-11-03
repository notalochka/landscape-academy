import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import Image from "next/image";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import CoursePurchaseModal from "../../components/CoursePurchaseModal/CoursePurchaseModal";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { pagesSEO } from "../../config/seo";

const Course1Page = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  
  const [targetRef, targetVisible] = useScrollAnimation({ threshold: 0.1 });
  const [authorRef, authorVisible] = useScrollAnimation({ threshold: 0.1 });
  const [skillsRef, skillsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [questionsRef, questionsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [programRef, programVisible] = useScrollAnimation({ threshold: 0.1 });
  
  const course1SEO = {
    title: "ШІ РЕНДЕР НА ТЕЛЕФОНІ - LANDSCAPER Academy",
    description: "Детальна інформація про курс ШІ РЕНДЕР НА ТЕЛЕФОНІ від LANDSCAPER Academy",
    keywords: "ШІ рендер, телефон, ландшафтний дизайн, курс, LANDSCAPER Academy",
    ogImage: "/images/og-course-1.jpg",
    canonical: "/course-1"
  };

  const FALLBACK_COURSE_ID = 2;
  const [courseData, setCourseData] = useState({
    id: null,
    title: 'ШІ РЕНДЕР НА ТЕЛЕФОНІ',
    subtitle: 'ВІД ЕСКІЗУ ДО WOW ЗА 5 ХВИЛИН',
    price: '1000 ГРН',
    old_price: '2500 ГРН',
    start_date: '20.09.2025',
    experience: '',
    group_info: '',
    duration: '',
    author_name: 'Катерина Комар',
    author_photo: '/ai-author-photo.png',
    author_bio_1: '',
    skills: ''
  });
  const [targetAudience, setTargetAudience] = useState([]);
  const [courseProgram, setCourseProgram] = useState([]);

  const router = useRouter();
  const routeId = router && router.query ? router.query.id : null;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // If specific id provided via query, prefer it
        const paramId = routeId ? parseInt(routeId) : null;
        // 1) Спробувати знайти курс напряму за типом через API
        let selectedCourse = null;
        if (!paramId) {
          const byTypeRes = await fetch('/api/courses?course_type=course-1');
          const byTypeJson = await byTypeRes.json();
          if (byTypeJson.success && Array.isArray(byTypeJson.data) && byTypeJson.data.length > 0) {
            selectedCourse = byTypeJson.data[0];
          } else {
          // 2) Фолбек: взяти зі списку курсів перший з course_type === 'course-1'
          const listRes = await fetch('/api/courses');
          const listJson = await listRes.json();
          if (listJson.success && Array.isArray(listJson.data)) {
            selectedCourse = listJson.data.find(c => c.course_type === 'course-1') || null;
          }
          }
        }

        // 3) Якщо знайшли id — завантажуємо деталі
        const courseId = paramId || selectedCourse?.id || FALLBACK_COURSE_ID;
        const res = await fetch(`/api/courses/${courseId}`);
        const json = await res.json();
        if (json.success && json.data) {
          setCourseData({
            id: json.data.id || courseId,
            title: json.data.title || 'ШІ РЕНДЕР НА ТЕЛЕФОНІ',
            subtitle: json.data.subtitle || 'ВІД ЕСКІЗУ ДО WOW ЗА 5 ХВИЛИН',
            price: json.data.price || '1000 ГРН',
            old_price: json.data.old_price || '2500 ГРН',
            start_date: json.data.start_date || '20.09.2025',
            experience: json.data.experience || '',
            group_info: json.data.group_info || '',
            duration: json.data.duration || '',
            problem_title: json.data.problem_title || '',
            problem_intro1: json.data.problem_intro1 || '',
            problem_intro2: json.data.problem_intro2 || '',
            result_title: json.data.result_title || '',
            result_list: json.data.result_list || '',
            result_conclusion: json.data.result_conclusion || '',
            solution_title: json.data.solution_title || '',
            solution_intro: json.data.solution_intro || '',
            solution_how_title: json.data.solution_how_title || '',
            solution_list: json.data.solution_list || '',
            solution_conclusion: json.data.solution_conclusion || '',
            author_name: json.data.author_name || 'Катерина Комар',
            author_photo: json.data.author_photo || '/ai-author-photo.png',
            author_bio_1: json.data.author_bio_1 || '',
            skills: json.data.skills || ''
          });

          // Завантажити цільову аудиторію
          try {
            const taRes = await fetch(`/api/courses/${courseId}/target-audience`);
            const taJson = await taRes.json();
            if (taJson.success && Array.isArray(taJson.data)) {
              setTargetAudience(taJson.data);
            }
          } catch (_) {}

          // Завантажити програму курсу
          try {
            const progRes = await fetch(`/api/courses/${courseId}/program`);
            const progJson = await progRes.json();
            if (progJson.success && Array.isArray(progJson.data)) {
              setCourseProgram(progJson.data);
            }
          } catch (_) {}
        }
      } catch (e) { /* no-op */ }
    };
    fetchCourse();
  }, [routeId]);

  return (
    <>
      <SEO
        title={course1SEO.title}
        description={course1SEO.description}
        keywords={course1SEO.keywords}
        ogImage={course1SEO.ogImage}
        canonical={course1SEO.canonical}
      />


      {/* Header Section */}
      <Header showBanner={false} />

      {/* Course Details Section */}
      <section className="la-course-1">
      <Link href="/courses" className="la-course-1__back-link">
            <div className="la-course-1__back-arrow">
              <span></span>
            </div>
            <span>ПОВЕРНУТИСЯ НАЗАД</span>
            
          </Link>
        <div className="la-course-1__container">
          
          
          <div className="la-course-1__content">
            <div className="la-course-1__left">
              <p className="la-course-1__program-label">ПРОГРАМА</p>
              <h1 className="la-course-1__title">{courseData.title}</h1>
              <p className="la-course-1__subtitle">{courseData.subtitle}</p>
            </div>
            
            <div className="la-course-1__right">
              <div className="la-course-1__info-box">
                <div className="la-course-1__info-content">
                  <p className="la-course-1__info-item">ДОСВІД</p>
                  <p className="la-course-1__info-item-date">{courseData.experience || '—'}</p>
                  <p className="la-course-1__info-item">СТАРТ</p>
                  <p className="la-course-1__info-item-date">{courseData.start_date}</p>
                  <p className="la-course-1__info-item">ГРУПА</p>
                  <p className="la-course-1__info-item-date">{courseData.group_info || '—'}</p>
                  <p className="la-course-1__info-item">ТРИВАЛІСТЬ</p>
                  <p className="la-course-1__info-item-date">{courseData.duration || '—'}</p>
                </div>
                <button 
                  className="la-course-1__button"
                  onClick={() => setIsPurchaseModalOpen(true)}
                >
                  ЗАПИСАТИСЯ НА КУРС
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="la-course-1__problem">
        <div className="la-course-1__problem-container">
          <h2 className="la-course-1__problem-title">
            {courseData.problem_title}
          </h2>
          <div className="la-course-1__problem-content">
            <div className="la-course-1__problem-left">
              <div className="la-course-1__problem-text">
                { courseData.problem_intro1 && (
                  <p>{courseData.problem_intro1}</p>
                )}
                { courseData.problem_intro2 && (
                  <p>{courseData.problem_intro2}</p>
                )}
              </div>
            </div>
            <div className="la-course-1__problem-right">
              <div className="la-course-1__problem-square">
                <Image
                  src="/course-1_photo-1.png"
                  alt="Problem visual"
                  width={500}
                  height={500}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Result Section */}
      <section className="la-course-1__result">
        <div className="la-course-1__result-container">
          <h2 className="la-course-1__result-title">{courseData.result_title}
          </h2>
          </div>
          <div className="la-course-1__result-line"></div>
          <div className="la-course-1__result-container">
          <ul className="la-course-1__result-list">
            {(courseData.result_list || '')
              .split(/\r?\n/)
              .filter(Boolean)
              .map((item, idx) => (
                <li key={idx}>{item}</li>
            ))}
          </ul>
          </div>
          {courseData.result_conclusion && (
          <div className="la-course-1__result-block">
              <p>{courseData.result_conclusion}</p>
          </div>
          )}
        
       </section>

       {/* Solution Section */}
       <section className="la-course-1__solution">
         <div className="la-course-1__solution-container">
           {courseData.solution_title && (
           <h2 className="la-course-1__solution-title">
               {courseData.solution_title}
           </h2>
           )}
           {courseData.solution_intro && (
           <p className="la-course-1__solution-description">
               {courseData.solution_intro}
           </p>
           )}
           {courseData.solution_how_title && (
             <p className="la-course-1__solution-description">{courseData.solution_how_title}</p>
           )}
           <div className="la-course-1__solution-block">
             <ul className="la-course-1__solution-list">
               {(courseData.solution_list || '')
                 .split(/\r?\n/)
                 .filter(Boolean)
                 .map((item, idx) => (
                   <li key={idx}>{item}</li>
               ))}
             </ul>
           </div>
           {courseData.solution_conclusion && (
           <p className="la-course-1__solution-conclusion">
               {courseData.solution_conclusion}
           </p>
           )}
         </div>
       </section>

       {/* Target Audience Section */}
      <section ref={targetRef} className={`la-course-1-target animate-fade-in-up ${targetVisible ? 'is-visible' : ''}`}>
        <div className="la-course-1-target__inner">
            <h2 className="la-course-1-target__title">ДЛЯ КОГО ЦЕЙ КУРС?</h2>
        </div>

        <div className="la-course-1-target__line"></div>
        <div className="la-course-1-target__inner">  
          <div className="la-course-1-target__content">
            <div className="la-course-1-target__list">
              {(targetAudience.length > 0
                ? targetAudience.map((item, index) => ({ number: String(index + 1).padStart(2, '0'), text: item.text }))
                : [
                    { number: '01', text: 'Ландшафтним дизайнерам, які втомилися від "а покажіть, як це виглядатиме"' },
                    { number: '02', text: 'Архітекторам, які хочуть презентувати зовнішній вигляд будівель' },
                    { number: '03', text: 'Інтер\'єрним дизайнерам для зонування приватних територій' },
                    { number: '04', text: 'Всім, хто працює з простором і хоче продавати ідеї, а не пояснювати їх' }
                  ]).map((it, idx) => (
                    <div key={idx} className="la-course-1-target__item">
                      <span className="la-course-1-target__number">{it.number}</span>
                      <p className="la-course-1-target__text">{it.text}</p>
              </div>
                  ))}
            </div>
            
            <div className="la-course-1-target__block">
              <Image
                src="/course-1_photo-2.png"
                alt="Target visual"
                width={684}
                height={453}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
        
      </section>

      {/* Author Section */}
      <section ref={authorRef} className={`la-course-1-author animate-fade-in-up ${authorVisible ? 'is-visible' : ''}`}>
        <div className="la-course-1-author__inner">
          <div className="la-course-1-author__content">
            <div className="la-course-1-author__info">
              <div className="la-course-1-author__header">
                <div className="la-course-1-author__logo">
                  <Image
                    src="/logo_academy.png"
                    alt="Landscape Academy"
                    width={73}
                    height={72}
                  />
                </div>
                <span className="la-course-1-author__label">АВТОР КУРСУ</span>
              </div>
                <div className="la-course-1-author__photo-mobile">
                  <Image
                    src={courseData.author_photo || '/ai-author-photo.png'}
                    alt={courseData.author_name || 'Автор курсу'}
                    width={611}
                    height={833}
                    className="la-course-1-author__image"
                  />
              </div>
              <h2 className="la-course-1-author__name">{courseData.author_name}</h2>
              
              <div className="la-course-1__author__description">
              <ul className="la-course-1__author__description">
                {(courseData.author_bio_1 || `Магістр садово-паркового дизайну\nСпівзасновниця LANDSCAPER Academy\n8+ років досвіду в маркетингу для особистих брендів\n2+ роки впроваджує ШІ-технології в роботу команди\nмаю сертифікат від Google по Основам ШІ`)
                  .split(/\r?\n/)
                  .filter(Boolean)
                  .map((line, idx) => (
                    <li key={idx}>{line}</li>
                ))}
              </ul>
              </div>
              
              <div className="la-course-1-author__buttons">
                <a href="#contact" className="la-course-1-author__button">ЗВ&apos;ЯЗАТИСЯ</a>
                <a href="#la-course-1-course-program" className="la-course-1-author__button">ПРО КУРС</a>
              </div>
            </div>
          </div>
          
          <div className="la-course-1-author__photo">
            <Image
              src={courseData.author_photo || '/ai-author-photo.png'}
              alt={courseData.author_name || 'Автор курсу'}
              width={611}
              height={833}
              className="la-course-1-author__image"
            />
          </div>
        </div>
        <div className="la-course-1-author__conclusion">
          <p>Я не навчаю робити рендери з нуля в Blender або 3ds Max. Я показую, як покращити ваші існуючі візуалізації на рівень, який працює на ваш бізнес і репутацію.
          </p>
        </div>
      </section>

      <section ref={skillsRef} className={`la-course-1-skills animate-fade-in-up ${skillsVisible ? 'is-visible' : ''}`}>
        <div className="la-course-1-skills__inner">
            <h2 className="la-course-1-skills__title">Особливо корисно, якщо ви:</h2>
        </div>

        <div className="la-course-1-skills__line"></div>

        <div className="la-course-1-skills__inner">
          <ul className="la-course-1-skills__list">
            {(courseData.skills || '')
              .split(/\r?\n/)
              .filter(Boolean)
              .map((skill, idx) => (
                <li key={idx} className="la-course-1-skills__item">{skill}</li>
              ))}
          </ul>
        </div>

        <div className="la-course-1-skills__line"></div>

      
      </section>

      {/* Contact Questions Section */}
      <section ref={questionsRef} className={`la-course-1-contact-questions animate-fade-in-up ${questionsVisible ? 'is-visible' : ''}`}>
        <div className="la-course-1-contact-questions__inner">
          <div className="la-course-1-contact-questions__block">
            <Image
              src="/question_photo.png"
              alt="Питання"
              width={180}
              height={133}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="la-course-1-contact-questions__content">
            <h2 className="la-course-1-contact-questions__text">ВІДПОВІМО ВАМ НА ВСІ ПИТАННЯ</h2>
            <div className="la-course-1-contact-questions__buttons">
              <a href="tel:+380956301304" className="la-course-1-contact-questions__button">ЗАТЕЛЕФОНУЙТЕ НАМ</a>
              <a href="https://t.me/komarkaterinamarketing" target="_blank" rel="noopener noreferrer" className="la-course-1-contact-questions__button">НАПИСАТИ В TELEGRAM</a>
            </div>
          </div>
        </div>
      </section>

      {/* Course Program Section */}
      <section id="la-course-1-course-program" ref={programRef} className={`la-course-program animate-fade-in-up ${programVisible ? 'is-visible' : ''}`}>
        <div className="la-course-program__inner">
          <div className="la-course-program__header">
            <div className="la-course-program__left">
              <p className="la-course-program__motto">{courseData.subtitle}</p>
            </div>
            <div className="la-course-program__right">
              <h2 className="la-course-program__title">курс: {courseData.title}</h2>
            </div>
          </div>
        </div>
        
        <div className="la-course-program__line"></div>
        
        <div className="la-course-program__inner">
          <div className="la-course-program__toggle">
            <h3 className="la-course-program__course-title">
             ПРОГРАМА КУРСУ
            </h3>
            <button 
              className="la-course-program__toggle-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label={isDropdownOpen ? 'Закрити програму' : 'Відкрити програму'}
            >
              <span className="la-course-program__toggle-text">ДЕТАЛЬНО</span>
              <span className={isDropdownOpen ? 'la-course-program__toggle-arrow open' : 'la-course-program__toggle-arrow'}>
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L10 10L19 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
          </div>
        </div>
          
          {isDropdownOpen && (
            <>
              {(() => {
                const modules = {};
                courseProgram.forEach(item => {
                  if (!modules[item.module_number]) {
                    modules[item.module_number] = { module: null, lessons: [] };
                  }
                  if (item.lesson_number === null) {
                    modules[item.module_number].module = item;
                  } else {
                    modules[item.module_number].lessons.push(item);
                  }
                });
                return Object.keys(modules)
                  .sort((a,b)=>parseFloat(a)-parseFloat(b))
                  .map((mKey, idx) => {
                    const m = modules[mKey];
                    return (
                      <React.Fragment key={mKey}>
              <div className="la-course-program__line"></div>
              <div className="la-course-program__inner">
                <div className="la-course-program__content">
                  <div className="la-course-program__module">
                    <div className="la-course-program__module-info">
                                <h4 className="la-course-program__module-number">{m.module?.module_title || `Модуль ${mKey}`}</h4>
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
                    );
                  });
              })()}
            </>
          )}
        
        <div className="la-course-program__line"></div>
      </section>

       {/* Order Section */}
       <section className="la-course-1-order">
         <div className="la-course-1-order__inner">
           <div className="la-course-1-order__content">
             <p className="la-course-1-order__text">
               ШІ НЕ ЗАМІНИТЬ ВАШУ ТВОРЧІСТЬ — ВІН ПІДСИЛИТЬ ЇЇ.
             </p>
             <p className="la-course-1-order__text">
               ВАШІ ІДЕЇ + ПОТУЖНІСТЬ ШТУЧНОГО ІНТЕЛЕКТУ = ПРОЄКТИ, ЯКІ ПРОДАЮТЬ СЕБЕ САМІ.
             </p>
             <p className="la-course-1-order__text">
               LANDSCAPER ACADEMY — ДЕ ПРАКТИЧНІ НАВИЧКИ ЗУСТРІЧАЮТЬСЯ З ТЕХНОЛОГІЯМИ МАЙБУТНЬОГО.
             </p>
           </div>
           
           <div className="la-course-1-order__card">
            <h2 className="la-course-1-order__title">КУРС: {courseData.title}</h2>
            <p className="la-course-1-order__start-date">СТАРТ {courseData.start_date}</p>
             
             <div className="la-course-1-order__pricing">
              <span className="la-course-1-order__old-price">{courseData.old_price} ГРН</span>
              <span className="la-course-1-order__new-price">{courseData.price} ГРН</span>
             </div>
             
             <button 
               className="la-course-1-order__button"
               onClick={() => setIsPurchaseModalOpen(true)}
             >
               ЗАМОВИТИ
             </button>
           </div>
         </div>
       </section>

       {/* Contact Section */}
       <div>
         <Contact />
       </div>
      
      {/* Footer */}
      <Footer />

      {/* Purchase Modal */}
      <CoursePurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        courseData={courseData}
      />
    </>
  );
};

export default Course1Page;

