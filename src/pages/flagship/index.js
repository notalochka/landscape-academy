import React, { useState } from "react";
import Image from "next/image";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { pagesSEO, courseSchema } from "../../config/seo";

const FlagshipPage = () => {
  const flagshipSEO = pagesSEO.flagship;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [mainRef, mainVisible] = useScrollAnimation({ threshold: 0.1 });
  const [studentsRef, studentsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [infoRef, infoVisible] = useScrollAnimation({ threshold: 0.1 });
  const [orderRef, orderVisible] = useScrollAnimation({ threshold: 0.1 });
  const [targetRef, targetVisible] = useScrollAnimation({ threshold: 0.1 });
  const [authorRef, authorVisible] = useScrollAnimation({ threshold: 0.1 });
  const [skillsRef, skillsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [questionsRef, questionsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [programRef, programVisible] = useScrollAnimation({ threshold: 0.1 });
  const [contactRef, contactVisible] = useScrollAnimation({ threshold: 0.1 });
  
  // Course structured data
  const flagshipCourseData = courseSchema({
    name: "Флагманський курс ландшафтного дизайну",
    description: "Комплексна програма навчання ландшафтному дизайну з професійними знаннями, практичними навичками та сертифікацією",
    price: "45000"
  });

  const studentImages = [
    "/students/inst_photo1.png",
    "/students/inst_photo2.png", 
    "/students/inst_photo3.png",
    "/students/inst_photo4.png",
    "/students/inst_photo5.png",
    "/students/inst_photo6.png",
    "/students/inst_photo7.png",
    "/students/inst_photo8.png",
    "/students/inst_photo9.png",
    "/students/inst_photo10.png",
    "/students/inst_photo11.png",
    "/students/inst_photo12.png"
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % studentImages.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + studentImages.length) % studentImages.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  return (
    <>
      <SEO
        title={flagshipSEO.title}
        description={flagshipSEO.description}
        keywords={flagshipSEO.keywords}
        ogImage={flagshipSEO.ogImage}
        canonical={flagshipSEO.canonical}
        structuredData={flagshipCourseData}
      />

      {/* Header Section */}
      <Header showBanner={false} />

      {/* Main Content */}
      <main ref={mainRef} className={`la-flagship-main animate-fade-in-up ${mainVisible ? 'is-visible' : ''}`}>
        <div className="la-flagship-main__inner">
          <section className="la-flagship-content">
            <div className="la-flagship-content__header">
              <span className="la-flagship-content__label">ПРОГРАМА</span>
              <h1 className="la-flagship-content__title">LANDSCAPER 5.0</h1>
              <h2 className="la-flagship-content__subtitle">ПЕРЕТВОРИ ХОБІ У БІЗНЕС</h2>
            </div>
            
            <div className="la-flagship-content__description">
              <p className="la-flagship-content__text">
                ЗА 6 ТИЖНІВ РАЗОМ ПРОЙДЕМО ШЛЯХ ВІД ЧІТКОГО ПЛАНУВАННЯ ДО ЗАЛУЧЕННЯ КЛІЄНТІВ ТА МАСШТАБУВАННЯ ДОХОДІВ
              </p>
              <p className="la-flagship-content__text">
                ОСВІТНІЙ КУРС ДЛЯ ЛАНДШАФТНИКІВ, ДИЗАЙНЕРІВ, САДІВНИКІВ, ТОПІАРНИКІВ ТА ВЛАСНИКІВ САДОВИХ ЦЕНТРІВ.
              </p>
            </div>

            <button className="la-flagship-content__button">
              <span>ЗАПИСАТИСЯ НА КУРС</span>
              <div className="la-flagship-content__button-arrow">
                <span></span>
              </div>
            </button>
          </section>
        </div>
      </main>


      {/* Students Carousel Section */}
      <section ref={studentsRef} className={`la-flagship-students animate-fade-in-up ${studentsVisible ? 'is-visible' : ''}`}>
        <div className="la-flagship-students__inner">
          <div className="la-flagship-students__header">
            <Image
              className="la-flagship-students__logo"
              src="/logo_academy.png"
              alt="Landscape Academy"
              width={150}
              height={150}
              style={{ objectFit: 'contain' }}
            />
            <h2 className="la-flagship-students__title">НАШІ СТУДЕНТИ</h2>
          </div>

          <div className="la-flagship-students__carousel">
            <div className="la-flagship-students__carousel-container">
              {[
                studentImages[(currentSlide - 1 + studentImages.length) % studentImages.length],
                studentImages[currentSlide],
                studentImages[(currentSlide + 1) % studentImages.length]
              ].map((image, index) => {
                const slideIndex = index === 0 ? (currentSlide - 1 + studentImages.length) % studentImages.length :
                                  index === 1 ? currentSlide :
                                  (currentSlide + 1) % studentImages.length;
                
                return (
                  <div 
                    key={slideIndex}
                    className={`la-flagship-students__slide ${index === 1 ? 'active' : ''} ${index === 0 ? 'left' : ''} ${index === 2 ? 'right' : ''} ${isTransitioning ? 'transitioning' : ''}`}
                  >
                    <div className="la-flagship-students__phone">
                      <Image
                        src={image}
                        alt={`Student ${slideIndex + 1}`}
                        width={350}
                        height={600}
                      />
                    </div>
                    
                    {/* Стрілки тільки для бокових фото */}
                    {index === 0 && (
                      <button 
                        className="la-flagship-students__arrow la-flagship-students__arrow--left"
                        onClick={prevSlide}
                        disabled={isTransitioning}
                        aria-label="Попередній студент"
                      >
                        <div className="la-flagship-students__arrow-inner">
                          <span></span>
                        </div>
                      </button>
                    )}
                    
                    {index === 2 && (
                      <button 
                        className="la-flagship-students__arrow la-flagship-students__arrow--right"
                        onClick={nextSlide}
                        disabled={isTransitioning}
                        aria-label="Наступний студент"
                      >
                        <div className="la-flagship-students__arrow-inner">
                          <span></span>
                        </div>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      {/* Course Info Section */}
      <section ref={infoRef} className={`la-flagship-course-info animate-fade-in-up ${infoVisible ? 'is-visible' : ''}`}>
        <div className="la-flagship-course-info__inner">
          <div className="la-flagship-course-info__details">
            <div className="la-flagship-course-info__item">
              <h3 className="la-flagship-course-info__label">ДОСВІД</h3>
              <p className="la-flagship-course-info__text">З 20 СІЧНЯ ПО 3 БЕРЕЗНЯ</p>
            </div>
            <div className="la-flagship-course-info__item">
              <h3 className="la-flagship-course-info__label">СТАРТ</h3>
              <p className="la-flagship-course-info__text">З 20 СІЧНЯ ПО 3 БЕРЕЗНЯ</p>
            </div>
            <div className="la-flagship-course-info__item">
              <h3 className="la-flagship-course-info__label">ГРУПА</h3>
              <p className="la-flagship-course-info__text">З 20 СІЧНЯ ПО 3 БЕРЕЗНЯ</p>
            </div>
            <div className="la-flagship-course-info__item">
              <h3 className="la-flagship-course-info__label">ТРИВАЛІСТЬ</h3>
              <p className="la-flagship-course-info__text">З 20 СІЧНЯ ПО 3 БЕРЕЗНЯ</p>
            </div>
          </div>
          
          <div className="la-flagship-course-info__stats">
            <div className="la-flagship-course-info__stat">
              <span className="la-flagship-course-info__number">25</span>
              <span className="la-flagship-course-info__stat-label">ТЕМ</span>
            </div>
            <div className="la-flagship-course-info__stat">
              <span className="la-flagship-course-info__number">9</span>
              <span className="la-flagship-course-info__stat-label">МОДУЛІВ</span>
            </div>
            <div className="la-flagship-course-info__stat">
              <span className="la-flagship-course-info__number">6</span>
              <span className="la-flagship-course-info__stat-label">ТИЖНІВ</span>
            </div>
            <div className="la-flagship-course-info__stat">
              <span className="la-flagship-course-info__number">2</span>
              <span className="la-flagship-course-info__stat-label">КУРАТОРИ</span>
            </div>
          </div>
        </div>
      </section>

      {/* Order Section */}
      <section ref={orderRef} className={`la-flagship-order animate-fade-in-up ${orderVisible ? 'is-visible' : ''}`}>
        <div className="la-flagship-order__inner">
          <p className="la-flagship-order__text">
            ЗАПИШІТЬСЯ ЗАРАЗ І ПОЧНІТЬ РЕАЛІЗОВУВАТИ СВОЇ ПРОФЕСІЙНІ АМБІЦІЇ З НАМИ. ЧАС РОБИТИ КРОК ВПЕРЕД — JUST DO IT.
          </p>
          
          <div className="la-flagship-order__card">
            <h2 className="la-flagship-order__title">LANDSCAPER 5.0</h2>
            <p className="la-flagship-order__start-date">СТАРТ 20.01.2025</p>
            
            <div className="la-flagship-order__pricing">
              <span className="la-flagship-order__old-price">15 000 ГРН</span>
              <span className="la-flagship-order__new-price">13 900 ГРН</span>
            </div>
            
            <button className="la-flagship-order__button">
              ЗАМОВИТИ
            </button>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section ref={targetRef} className={`la-flagship-target animate-fade-in-up ${targetVisible ? 'is-visible' : ''}`}>
        <div className="la-flagship-target__inner">
            <h2 className="la-flagship-target__title">ДЛЯ КОГО ЦЕЙ КУРС?</h2>
        </div>

        <div className="la-flagship-target__line"></div>
        <div className="la-flagship-target__inner">  
          <div className="la-flagship-target__content">
            <div className="la-flagship-target__list">
              <div className="la-flagship-target__item">
                <span className="la-flagship-target__number">01</span>
                <p className="la-flagship-target__text">
                  ЛАНДШАФТНИЙ ДИЗАЙНЕР ПОЧАТКІВЕЦЬ БЕЗ ДОСВІДУ РОБОТИ З БАЖАННЯМ ВЗЯТИ СВІЙ ПЕРШИЙ ПРОЕКТ
                </p>
              </div>
              <div className="la-flagship-target__item">
                <span className="la-flagship-target__number">02</span>
                <p className="la-flagship-target__text">
                  ПРАКТИК В СТВОРЕННІ САДІВ, ЩО БАЖАЄ ПОКРАЩИТИ СВОЇ НАВИЧКИ З ДИЗАЙНУ
                </p>
              </div>
              <div className="la-flagship-target__item">
                <span className="la-flagship-target__number">03</span>
                <p className="la-flagship-target__text">
                  АРХІТЕКТОР З ЗАПИТАМИ НА ОЗЕЛЕНЕННЯ ПРИБУДИНКОВИХ ТОРИТОРІЙ
                </p>
              </div>
              <div className="la-flagship-target__item">
                <span className="la-flagship-target__number">04</span>
                <p className="la-flagship-target__text">
                  ВЖЕ МАЄТЕ ДОСВІД СТВОРЕННЯ САДУ, АЛЕ ВИТРАЧАЄТЕ НА ЦЕ БАГАТО ЧАСУ ЧЕРЕЗ ВІДСУТНІСТЬ АЛГОРИТМУ
                </p>
              </div>
              <div className="la-flagship-target__item">
                <span className="la-flagship-target__number">05</span>
                <p className="la-flagship-target__text">
                  ВЛАСНИК КОМПАНІЇ З СТВОРЕННЯ САДІВ І БАЖАЄТЕ РОЗШИРИТИ КОМАНДУ ЧИ ДЕЛЕГУВАТИ ПІДЛЕГЛОМУ НАПРЯМОК ДИЗАЙНУ
                </p>
              </div>
            </div>
            
            <div className="la-flagship-target__block"></div>
          </div>
        </div>
        
      </section>

      {/* Author Section */}
      <section ref={authorRef} className={`la-flagship-author animate-fade-in-up ${authorVisible ? 'is-visible' : ''}`}>
        <div className="la-flagship-author__inner">
          <div className="la-flagship-author__content">
            <div className="la-flagship-author__info">
              <div className="la-flagship-author__header">
                <div className="la-flagship-author__logo">
                  <Image
                    src="/logo_academy.png"
                    alt="Landscape Academy"
                    width={73}
                    height={72}
                  />
                </div>
                <span className="la-flagship-author__label">АВТОР КУРСУ</span>
              </div>
              
              <h2 className="la-flagship-author__name">КОМАР МИКОЛА</h2>
              
              <div className="la-flagship-author__description">
                <p className="la-flagship-author__text">
                  МАГІСТРИ САДОВО-ПАРКОВОГО ГОСПОДАРСТВА ТА МИСТЕЦТВА. ПРАКТИКУЮЧИЙ ЛАНДШАФТНИЙ ДИЗАЙНЕР. АВТОР КУРСУ LANDSCAPER, СПІВЗАСНОВНИК LANDSCAPR ACADEMY, ТОВ «ВАШВИМІР» ТА KAVAFM.
                </p>
                <p className="la-flagship-author__text">
                  17 РОКІВ НА РИНКУ, СТОВРИВ 100+ САДІВ ВІД 30 М.КВ ДО 11 ГА.
                </p>
              </div>
              
              <div className="la-flagship-author__buttons">
                <button className="la-flagship-author__button">ЗВ&apos;ЯЗАТИСЯ</button>
                <button className="la-flagship-author__button">ПРО КУРС</button>
              </div>
            </div>
          </div>
          
          <div className="la-flagship-author__photo">
            <Image
              src="/author-photo.png"
              alt="Комар Микола"
              width={611}
              height={833}
              className="la-flagship-author__image"
            />
          </div>
        </div>
      </section>

      <section ref={skillsRef} className={`la-flagship-skills animate-fade-in-up ${skillsVisible ? 'is-visible' : ''}`}>
        <div className="la-flagship-skills__inner">
            <h2 className="la-flagship-skills__title">навички які ви зможете опанувати:</h2>
        </div>

        <div className="la-flagship-skills__line"></div>

        <div className="la-flagship-skills__inner">
          <ul className="la-flagship-skills__list">
            <li className="la-flagship-skills__item">
              ОТРИМАЄТЕ ЧІТКІ ВКАЗІВКИ З ПОЕТАПНОГО СТВОРЕННЯ САДУ, ОПАНУЄТЕ ЗАГАЛЬНИЙ АЛГОРИТМ
            </li>
            <li className="la-flagship-skills__item">
              НАВЧИТЕСЯ ПРАВИЛЬНО І ЧІТКО ЗБИРАТИ ІНФОРМАЦІЮ ДЛЯ ПРОЕКТУВАННЯ
            </li>
            <li className="la-flagship-skills__item">
              ПОЧНЕТЕ ГРАМОТНО ПРАЦЮВАТИ З ОБМЕЖЕННЯМИ
            </li>
            <li className="la-flagship-skills__item">
              ВІД ЕТАПУ КОНЦЕПЦІЇ ДО СТВОРЕННЯ ДИЗАЙНУ
            </li>
            <li className="la-flagship-skills__item">
              ОТРИМАЄТЕ ГОТОВІ ЧЕК-ЛИСТИ ДЛЯ РОЗМОВИ З КЛІЄНТОМ І СТВОРЕННЯ ТЕХНІЧНОГО ЗАВДАННЯ НА ПРОЕКТУВАННЯ
            </li>
            <li className="la-flagship-skills__item">
              ДІЗНАЄТЕСЬ ЯК ВЗАЄМОДІЯТИ З СУМІЖНИКАМИ ТА СТАВИТИ ЇМ ТЕХНІЧНІ ЗАВДАННЯ
            </li>
            <li className="la-flagship-skills__item">
              ОПАНУЄТЕ ЯК ТИПОВІ, ТАК І УНІКАЛЬНІ ТЕХНІКИ ДИЗАЙНУ
            </li>
            <li className="la-flagship-skills__item">
              НАПРИКІНЦІ КУРСУ ВАС ЧЕКАТИМЕ СТВОРЕННЯ САДУ З ПЕРЕВІРКОЮ ТА ФІДБЕКОМ
            </li>
          </ul>
        </div>

        <div className="la-flagship-skills__line"></div>

      
      </section>

      {/* Contact Questions Section */}
      <section ref={questionsRef} className={`la-flagship-contact-questions animate-fade-in-up ${questionsVisible ? 'is-visible' : ''}`}>
        <div className="la-flagship-contact-questions__inner">
          <div className="la-flagship-contact-questions__block"></div>
          <div className="la-flagship-contact-questions__content">
            <h2 className="la-flagship-contact-questions__text">ВІДПОВІМО ВАМ НА ВСІ ПИТАННЯ</h2>
            <div className="la-flagship-contact-questions__buttons">
              <button className="la-flagship-contact-questions__button">ЗАТЕЛЕФОНУЙТЕ НАМ</button>
              <button className="la-flagship-contact-questions__button">НАПИСАТИ В TELEGRAM</button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Program Section */}
      <section ref={programRef} className={`la-flagship-course-program animate-fade-in-up ${programVisible ? 'is-visible' : ''}`}>
        <div className="la-flagship-course-program__inner">
          <div className="la-flagship-course-program__header">
            <div className="la-flagship-course-program__left">
              <p className="la-flagship-course-program__motto">
                ВІД ІДЕЇ ДО<br />
                РЕАЛЬНОСТІ, ВІД МРІЇ<br />
                ДО ДІЇ.
              </p>
            </div>
            <div className="la-flagship-course-program__right">
              <h2 className="la-flagship-course-program__title">ПРОГРАМА КУРСУ</h2>
              <div className="la-flagship-course-program__schedule">
                <p className="la-flagship-course-program__schedule-text">ВЕБІНАРИ</p>
                <p className="la-flagship-course-program__schedule-text">ПН-ПТ</p>
                <p className="la-flagship-course-program__schedule-text">15:00-19:00</p>
              </div>
            </div>
          </div>
          
          <div className="la-flagship-course-program__line"></div>
          
          <div className="la-flagship-course-program__toggle">
            <h3 className="la-flagship-course-program__course-title">
              LANDSCAPER 5.0 : ПЕРЕТВОРИ ХОБІ У БІЗНЕС
            </h3>
            <button 
              className="la-flagship-course-program__toggle-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label={isDropdownOpen ? 'Закрити програму' : 'Відкрити програму'}
            >
              <span className={isDropdownOpen ? 'la-flagship-course-program__toggle-icon open' : 'la-flagship-course-program__toggle-icon'}>
                <span></span>
              </span>
            </button>
          </div>
          
          {isDropdownOpen && (
            <>
              <div className="la-flagship-course-program__line"></div>
              
              <div className="la-flagship-course-program__content">
                <div className="la-flagship-course-program__module">
                  <div className="la-flagship-course-program__module-info">
                    <h4 className="la-flagship-course-program__module-number">МОДУЛЬ 1</h4>
                    <h5 className="la-flagship-course-program__module-title">АНАЛІЗ СИТУАЦІЇ</h5>
                  </div>
                  
                  <div className="la-flagship-course-program__lessons">
                    <ul className="la-flagship-course-program__lesson-list">
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                          УРОК 1 - СИТУАЦІЯ НА РИНКУ
                        </p>
                        <p className="la-flagship-course-program__lesson-description">
                          ( НАША РЕАЛЬНІСТЬ, ТРЕНДИ, ПРОБЛЕМИ ТА МОЖЛИВОСТІ)
                        </p>
                      </li>
                      
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                          УРОК 2 - НАПРЯМКИ РОЗВИТКУ
                        </p>
                        <p className="la-flagship-course-program__lesson-description">
                          ( ПЕРСПЕКТИВИ І НАПРЯМКИ В НІШІ ЛД)
                        </p>
                      </li>
                      
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                          УРОК 3 - МАСШТАБ ОСОБИСТОСТІ
                        </p>
                        <p className="la-flagship-course-program__lesson-description">
                          ( ШЛЯХИ ПРОФЕСІЙНОГО РОЗВИТКУ)
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="la-flagship-course-program__line"></div>
              
              <div className="la-flagship-course-program__content">
                <div className="la-flagship-course-program__module">
                  <div className="la-flagship-course-program__module-info">
                    <h4 className="la-flagship-course-program__module-number">МОДУЛЬ 2</h4>
                    <h5 className="la-flagship-course-program__module-title">ЕКСПЕРТНІСТЬ</h5>
                  </div>
                  
                  <div className="la-flagship-course-program__lessons">
                    <ul className="la-flagship-course-program__lesson-list">
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                          УРОК 1 - Розпаковка експертності
                        </p>
                        <p className="la-flagship-course-program__lesson-description">
                          ( пошук своїх сильних сторін)
                        </p>
                      </li>
                      
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                          УРОК 2 - Фундамент експертності
                        </p>
                        <p className="la-flagship-course-program__lesson-description">
                          ( аналіз наявних результатів)
                        </p>
                      </li>
                      
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                          УРОК 3 - Кейси в ЛД
                        </p>
                        <p className="la-flagship-course-program__lesson-description">
                          ( важливість збору кейсів)
                        </p>
                      </li>
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                          УРОК 4 - Школа бренду
                        </p>
                        <p className="la-flagship-course-program__lesson-description">
                          ( як створите власний бренд)
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="la-flagship-course-program__line"></div>
              
              <div className="la-flagship-course-program__content">
                <div className="la-flagship-course-program__module">
                  <div className="la-flagship-course-program__module-info">
                    <h4 className="la-flagship-course-program__module-number">МОДУЛЬ 3</h4>
                    <h5 className="la-flagship-course-program__module-title">самопрезентація</h5>
                  </div>
                  
                  <div className="la-flagship-course-program__lessons">
                    <ul className="la-flagship-course-program__lesson-list">
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                        Практична робота 1 - Робота в групі з експертністю.
                        </p>
                        
                      </li>
                      
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                        Практична робота 2 - Продай себе за хвилину. 
                        </p>
                        
                      </li>
                      
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                         Практична робота 3 - Пізнай свого клієнта.
                        </p>
                        
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="la-flagship-course-program__line"></div>
              
              <div className="la-flagship-course-program__content">
                <div className="la-flagship-course-program__module">
                  <div className="la-flagship-course-program__module-info">
                    <h4 className="la-flagship-course-program__module-number">МОДУЛЬ 4</h4>
                    <h5 className="la-flagship-course-program__module-title">собівартість</h5>
                  </div>
                  
                  <div className="la-flagship-course-program__lessons">
                    <ul className="la-flagship-course-program__lesson-list">
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                        Практична робота 1- Рахуємо собівартість робочого дня
                        </p>
                      
                      </li>
                      
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                          Практична робота 2 - Скидаєм баласт 
                        </p>
                        <p className="la-flagship-course-program__lesson-description">
                          ( Аналіз клієнтів)
                        </p>
                      </li>
                      
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                          Урок 1 - Оптимізація та ефективність
                        </p>
                        
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="la-flagship-course-program__line"></div>
              
              <div className="la-flagship-course-program__content">
                <div className="la-flagship-course-program__module">
                  <div className="la-flagship-course-program__module-info">
                    <h4 className="la-flagship-course-program__module-number">МОДУЛЬ 5</h4>
                    <h5 className="la-flagship-course-program__module-title">підвищення ціни</h5>
                  </div>
                  
                  <div className="la-flagship-course-program__lessons">
                    <ul className="la-flagship-course-program__lesson-list">
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                          Урок 1 - Коли піднімати ціни.
                        </p>
                      
                      </li>
                      
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                          Урок 2 - Сервіс.
                        </p>
                        <p className="la-flagship-course-program__lesson-description">
                        - Скрипт
                        </p>
                        <p className="la-flagship-course-program__lesson-description">
                        - Бріф
                        </p>
                        <p className="la-flagship-course-program__lesson-description">
                        - Договір
                        </p>
                        <p className="la-flagship-course-program__lesson-description">
                        - Збір даних
                        </p>
                        <p className="la-flagship-course-program__lesson-description">
                        - Портфоліо
                        </p>
                        <p className="la-flagship-course-program__lesson-description">
                        - Перше враження
                        </p>
                      </li>
                                   
                    </ul>
                  </div>
                </div>
              </div>

              <div className="la-flagship-course-program__line"></div>
              
              <div className="la-flagship-course-program__content">
                <div className="la-flagship-course-program__module">
                  <div className="la-flagship-course-program__module-info">
                    <h4 className="la-flagship-course-program__module-number">МОДУЛЬ 6</h4>
                    <h5 className="la-flagship-course-program__module-title">план ефективності
                    </h5>
                  </div>
                  
                  <div className="la-flagship-course-program__lessons">
                    <ul className="la-flagship-course-program__lesson-list">
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                          Урок 1 - Обмежуючі переконання
                        </p>
                      
                      </li>
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                         Практична робота 1 - Ставимо мету
                        </p>
                      
                      </li>
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                         Практична робота 2 - Плануємо дохід та чек
                        </p>
                      
                      </li>
                      <li className="la-flagship-course-program__lesson">
                        <p className="la-flagship-course-program__lesson-title">
                         Урок 2 - Отримання навичок
                        </p>
                      
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="la-flagship-course-program__line"></div>
              
              <div className="la-flagship-course-program__content">
                <div className="la-flagship-course-program__module">
                  <div className="la-flagship-course-program__module-info">
                    <h4 className="la-flagship-course-program__module-number">МОДУЛЬ Бонус 7</h4>
                    <h5 className="la-flagship-course-program__module-title">Бухгалтерія в ЛД
                    </h5>
                    <h4 className="la-flagship-course-program__module-number">МОДУЛЬ Бонус 8</h4>
                    <h5 className="la-flagship-course-program__module-title">Бухгалтерія в ЛД
                    </h5>
                    <h4 className="la-flagship-course-program__module-number">МОДУЛЬ Бонус 9</h4>
                    <h5 className="la-flagship-course-program__module-title">Бухгалтерія в ЛД
                    </h5>
                  </div>
                </div>
              </div>




            </>
          )}
        </div>
        <div className="la-flagship-course-program__line"></div>
      </section>

      <Contact />
      <Footer />
    </>
  );
};

export default FlagshipPage;
