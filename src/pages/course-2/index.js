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

const Course2Page = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  
  const [targetRef, targetVisible] = useScrollAnimation({ threshold: 0.1 });
  const [authorRef, authorVisible] = useScrollAnimation({ threshold: 0.1 });
  const [skillsRef, skillsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [questionsRef, questionsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [programRef, programVisible] = useScrollAnimation({ threshold: 0.1 });
  
  const course2SEO = {
    title: "Метод роботи практикуючого ландшафтного дизайнера",
    description: "Детальна інформація про курс Метод роботи практикуючого ландшафтного дизайнера",
    keywords: "Метод роботи дизайнера, телефон, ландшафтний дизайн, курс, LANDSCAPER Academy",
    ogImage: "/images/og-course-2.jpg",
    canonical: "/course-2"
  };

  const FALLBACK_COURSE_ID = 3;
  const [courseData, setCourseData] = useState({
    id: null,
    title: 'Метод роботи практикуючого ландшафтного дизайнера',
    subtitle: 'Або в чому секрет виходу на високий чек',
    price: '',
    old_price: '',
    start_date: '',
    experience: '',
    group_info: '',
    duration: '',
    problem_title: '',
    problem_intro1: '',
    problem_intro2: '',
    result_title: '',
    result_list: '',
    result_conclusion: '',
    author_name: 'Анастасія Яковець',
    author_photo: '/methods-author-photo.png',
    author_bio_1: '',
    skills: ''
  });
  const [targetAudienceData, setTargetAudienceData] = useState([]);
  const [courseProgram, setCourseProgram] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const paramId = router.query?.id ? parseInt(router.query.id) : null;
        let selectedCourse = null;
        if (!paramId) {
          let byType = await fetch('/api/courses?course_type=course-2');
          const byTypeJson = await byType.json();
          if (byTypeJson.success && Array.isArray(byTypeJson.data) && byTypeJson.data.length > 0) {
            selectedCourse = byTypeJson.data[0];
          } else {
            // спробувати без фільтру активності
            byType = await fetch('/api/courses?course_type=course-2&all=1');
            const byTypeAllJson = await byType.json();
            if (byTypeAllJson.success && Array.isArray(byTypeAllJson.data) && byTypeAllJson.data.length > 0) {
              selectedCourse = byTypeAllJson.data[0];
            }
            // резервний варіант
            const list = await fetch('/api/courses');
            const listJson = await list.json();
            if (listJson.success) selectedCourse = listJson.data.find(c => c.course_type === 'course-2');
          }
        }

        const courseId = paramId || selectedCourse?.id || FALLBACK_COURSE_ID;
        const res = await fetch(`/api/courses/${courseId}`);
        const json = await res.json();
        if (json.success && json.data) {
          setCourseData({
            id: json.data.id || courseId,
            title: json.data.title || 'Метод роботи практикуючого ландшафтного дизайнера',
            subtitle: json.data.subtitle || 'Або в чому секрет виходу на високий чек',
            price: json.data.price || '',
            old_price: json.data.old_price || '',
            start_date: json.data.start_date || '',
            experience: json.data.experience || '',
            group_info: json.data.group_info || '',
            duration: json.data.duration || '',
            problem_title: json.data.problem_title || '',
            problem_intro1: json.data.problem_intro1 || '',
            problem_intro2: json.data.problem_intro2 || '',
            result_title: json.data.result_title || '',
            result_list: json.data.result_list || '',
            result_conclusion: json.data.result_conclusion || '',
            author_name: json.data.author_name || 'Анастасія Яковець',
            author_photo: json.data.author_photo || '/methods-author-photo.png',
            author_bio_1: json.data.author_bio_1 || '',
            skills: json.data.skills || ''
          });

          try {
            const taRes = await fetch(`/api/courses/${courseId}/target-audience`);
            const taJson = await taRes.json();
            if (taJson.success) setTargetAudienceData(taJson.data);
          } catch (_) {}

          try {
            const progRes = await fetch(`/api/courses/${courseId}/program`);
            const progJson = await progRes.json();
            if (progJson.success) setCourseProgram(progJson.data);
          } catch (_) {}
        }
      } catch (_) {}
    };
    fetchCourse();
  }, []);

  return (
    <>
      <SEO
        title={course2SEO.title}
        description={course2SEO.description}
        keywords={course2SEO.keywords}
        ogImage={course2SEO.ogImage}
        canonical={course2SEO.canonical}
      />

      {/* Header Section */}
      <Header showBanner={false} />

      {/* Course Details Section */}
      <section className="la-course-2">
      <Link href="/courses" className="la-course-2__back-link">
            <div className="la-course-2__back-arrow">
              <span></span>
            </div>
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
                <button 
                  className="la-course-2__button"
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
            <div className="la-course-2__problem-right">
              <div className="la-course-2__problem-square"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Result Section */}
      <section className="la-course-2__result">
        <div className="la-course-2__result-container">
          {courseData.result_title && (
            <h2 className="la-course-2__result-title">{courseData.result_title}</h2>
          )}
          </div>
          <div className="la-course-2__result-line"></div>
          <div className="la-course-2__result-container">
          <ul className="la-course-2__result-list">
            {(courseData.result_list || '').split(/\r?\n/).filter(Boolean).map((item,idx)=> (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          </div>
          {courseData.result_conclusion && (
          <div className="la-course-2__result-block">
              <p>{courseData.result_conclusion}</p>
          </div>
          )}
        
       </section>
       {/* Target Audience Section */}
      <section ref={targetRef} className={`la-course-2-target animate-fade-in-up ${(targetVisible || (targetAudienceData && targetAudienceData.length > 0)) ? 'is-visible' : ''}`}>
        <div className="la-course-2-target__inner">
            <h2 className="la-course-2-target__title">ДЛЯ КОГО ЦЕЙ КУРС?</h2>
        </div>
        <div className="la-course-2-target__line"></div>
        <div className="la-course-2-target__inner">  
          <div className="la-course-2-target__content">
            <div className="la-course-2-target__list">
              {(targetAudienceData && targetAudienceData.length > 0
                ? targetAudienceData.map((item, index) => ({ number: String(index + 1).padStart(2, '0'), text: item.text }))
                : []
              ).map((it, idx) => (
                <div key={idx} className="la-course-2-target__item">
                  <span className="la-course-2-target__number">{it.number}</span>
                  <p className="la-course-2-target__text">{it.text}</p>
              </div>
              ))}
            </div>
            
            <div className="la-course-2-target__block">
              <Image
                src="/target-2.png"
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
      <section ref={authorRef} className={`la-course-2-author animate-fade-in-up ${(authorVisible || courseData.author_name || courseData.author_bio_1) ? 'is-visible' : ''}`}>
        <div className="la-course-2-author__inner">
          <div className="la-course-2-author__content">
            <div className="la-course-2-author__info">
              <div className="la-course-2-author__header">
                <div className="la-course-2-author__logo">
                  <Image
                    src="/logo_academy.png"
                    alt="Landscape Academy"
                    width={73}
                    height={72}
                  />
                </div>
                <span className="la-course-2-author__label">АВТОР КУРСУ</span>
              </div>
              <div className="la-course-1-author__photo-mobile">
                  <Image
                    src={courseData.author_photo || '/methods-author-photo.png'}
                    alt={courseData.author_name || 'Автор курсу'}
                    width={611}
                    height={833}
                    className="la-course-1-author__image"
                  />
              </div>
              
              <h2 className="la-course-2-author__name">{courseData.author_name}</h2>
              
              <div className="la-course-2__author__description">
              <ul className="la-course-2__author__description">
                {(courseData.author_bio_1 || '').split(/\r?\n/).filter(Boolean).map((line,idx)=>(
                  <li key={idx}>{line}</li>
                ))}
              </ul>
              </div>
              
              <div className="la-course-2-author__buttons">
                <a href="#contact" className="la-course-2-author__button">ЗВ&apos;ЯЗАТИСЯ</a>
                <a href="#la-course-2-course-program" className="la-course-2-author__button">ПРО КУРС</a>
              </div>
            </div>
          </div>
          
          <div className="la-course-2-author__photo">
            <Image
              src={courseData.author_photo || '/methods-author-photo.png'}
              alt={courseData.author_name || 'Автор курсу'}
              width={611}
              height={833}
              className="la-course-2-author__image"
            />
          </div>
        </div>
      </section>


      {/* Contact Questions Section */}
      <section ref={questionsRef} className={`la-course-2-contact-questions animate-fade-in-up ${questionsVisible ? 'is-visible' : ''}`}>
        <div className="la-course-2-contact-questions__inner">
          <div className="la-course-2-contact-questions__block">
            <Image
              src="/question_photo.png"
              alt="Питання"
              width={180}
              height={133}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
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
      <section id="la-course-2-course-program" ref={programRef} className={`la-course-program animate-fade-in-up ${programVisible ? 'is-visible' : ''}`}>
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
              // групування по модулях
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
                .sort((a, b) => parseFloat(a) - parseFloat(b))
                .map(key => {
                  const m = modules[key];
                  return (
                    <React.Fragment key={key}>
              <div className="la-course-program__line"></div>
              <div className="la-course-program__inner">
                <div className="la-course-program__content">
                  <div className="la-course-program__module">
                    <div className="la-course-program__module-info">
                              <h4 className="la-course-program__module-number">
                                {m.module?.module_title || `Модуль ${key}`}
                    </h4>
                              {m.module?.module_description && (
                                <h5 className="la-course-program__module-title">
                                  {m.module.module_description}
                                </h5>
                              )}
                    </div>
                  
                    <div className="la-course-program__lessons">
                      <ul className="la-course-program__lesson-list">
                                {m.lessons.map((lesson, i) => (
                                  <li key={i} className="la-course-program__lesson">
                        <p className="la-course-program__lesson-title">
                                      {lesson.lesson_title}
                                    </p>
                                    {lesson.lesson_description && (
                                      <p className="la-course-program__lesson-description">
                                        {lesson.lesson_description}
                                      </p>
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
       <section className="la-course-2-order">
         <div className="la-course-2-order__inner">
           <div className="la-course-2-order__content">
             <p className="la-course-2-order__text">
             Кожен день без системи — це втрачені гроші та репутація. Поки ви працюєте наосліп, ваші конкуренти використовують професійні методи та отримують високі чеки.
             </p>
             <p className="la-course-2-order__text">
             LANDSCAPER Academy — де практичний досвід перетворюється на робочі інструменти для вашого бізнесу.
             </p>
           </div>
           
           <div className="la-course-2-order__card">
             <h2 className="la-course-2-order__title">курс: {courseData.title}</h2>
             <p className="la-course-2-order__start-date">СТАРТ: {courseData.start_date}</p>
             
             <div className="la-course-2-order__pricing">
               <span className="la-course-2-order__old-price">{courseData.old_price} ГРН</span>
               <span className="la-course-2-order__new-price">{courseData.price} ГРН</span>
             </div>
             
             <button 
               className="la-course-2-order__button"
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

export default Course2Page;
