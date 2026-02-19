import React, { useState, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import CoursePurchaseModal from "../../components/CoursePurchaseModal/CoursePurchaseModal";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { pagesSEO, courseSchema } from "../../config/seo";

const FlagshipPage = () => {
  const flagshipSEO = pagesSEO.flagship;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [courseData, setCourseData] = useState({
    mainTitle: "LANDSCAPER 5.0",
    subtitle: "ПЕРЕТВОРИ ХОБІ У БІЗНЕС",
    featured_image: null,
    description1: "ЗА 6 ТИЖНІВ РАЗОМ ПРОЙДЕМО ШЛЯХ ВІД ЧІТКОГО ПЛАНУВАННЯ ДО ЗАЛУЧЕННЯ КЛІЄНТІВ ТА МАСШТАБУВАННЯ ДОХОДІВ",
    description2: "ОСВІТНІЙ КУРС ДЛЯ ЛАНДШАФТНИКІВ, ДИЗАЙНЕРІВ, САДІВНИКІВ, ТОПІАРНИКІВ ТА ВЛАСНИКІВ САДОВИХ ЦЕНТРІВ",
    price: "13900",
    oldPrice: "15000",
    startDate: "20.01.2025",
    experience: "",
    group_info: "",
    duration: "6 тижнів",
    modules: "9 модулів",
    themes: "25 тем",
    curators: "2 куратори",
    authorName: "КОМАР МИКОЛА",
    authorBio1: "МАГІСТР САДОВО-ПАРКОВОГО ГОСПОДАРСТВА ТА МИСТЕЦТВА. ПРАКТИКУЮЧИЙ ЛАНДШАФТНИЙ ДИЗАЙНЕР. АВТОР КУРСУ LANDSCAPER, СПІВЗАСНОВНИК LANDSCAPR ACADEMY, ТОВ «ВАШВИMIP» TA KAVAFM.",
    authorBio2: "17 РОКІВ НА РИНКУ, СТОВРИВ 100+ САДІВ ВІД 30 М.КВ ДО 11 ГА.",
    authorPhoto: "",
    skills: ""
  });
  const [targetAudience, setTargetAudience] = useState([]);
  const [courseProgram, setCourseProgram] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Touch events for swipe functionality
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
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
  
  // Завантаження даних курсу з API
  useEffect(() => {
    console.log('useEffect запущений');
    const fetchData = async () => {
      try {
        console.log('Завантаження даних курсу...');
        
        // Завантажуємо дані флагманського курсу (ID = 1)
        const courseResponse = await fetch('/api/courses/1');
        console.log('Course response status:', courseResponse.status);
        const courseResult = await courseResponse.json();
        
        console.log('Course API Response:', courseResult);
        
        if (courseResult.success) {
          const newCourseData = {
            mainTitle: courseResult.data.title || "LANDSCAPER 5.0",
            subtitle: courseResult.data.subtitle || "ПЕРЕТВОРИ ХОБІ У БІЗНЕС",
            description1: courseResult.data.description_1 || "ЗА 6 ТИЖНІВ РАЗОМ ПРОЙДЕМО ШЛЯХ ВІД ЧІТКОГО ПЛАНУВАННЯ ДО ЗАЛУЧЕННЯ КЛІЄНТІВ ТА МАСШТАБУВАННЯ ДОХОДІВ",
            description2: courseResult.data.description_2 || "ОСВІТНІЙ КУРС ДЛЯ ЛАНДШАФТНИКІВ, ДИЗАЙНЕРІВ, САДІВНИКІВ, ТОПІАРНИКІВ ТА ВЛАСНИКІВ САДОВИХ ЦЕНТРІВ",
            price: courseResult.data.price || "13900",
            oldPrice: courseResult.data.old_price || "15000",
            startDate: courseResult.data.start_date || "20.01.2025",
            experience: courseResult.data.experience || "",
            group_info: courseResult.data.group_info || "",
            duration: courseResult.data.duration || "6 тижнів",
            modules: courseResult.data.modules || "9 модулів",
            themes: courseResult.data.themes || "25 тем",
            curators: courseResult.data.curators || "2 куратори",
            authorName: courseResult.data.author_name || "КОМАР МИКОЛА",
            authorBio1: courseResult.data.author_bio_1 || "МАГІСТР САДОВО-ПАРКОВОГО ГОСПОДАРСТВА ТА МИСТЕЦТВА. ПРАКТИКУЮЧИЙ ЛАНДШАФТНИЙ ДИЗАЙНЕР. АВТОР КУРСУ LANDSCAPER, СПІВЗАСНОВНИК LANDSCAPR ACADEMY, ТОВ «ВАШВИMIP» TA KAVAFM.",
            authorBio2: courseResult.data.author_bio_2 || "17 РОКІВ НА РИНКУ, СТОВРИВ 100+ САДІВ ВІД 30 М.КВ ДО 11 ГА.",
            authorPhoto: courseResult.data.author_photo || "",
            featured_image: courseResult.data.featured_image || null,
            skills: courseResult.data.skills || ""
          };
          
          console.log('Оновлені дані курсу:', newCourseData);
          setCourseData(newCourseData);
          console.log('Дані курсу встановлені');
        } else {
          console.error('Course API повернув помилку:', courseResult.message);
        }

        // Завантажуємо цільову аудиторію
        console.log('Завантаження цільової аудиторії...');
        const audienceResponse = await fetch('/api/courses/1/target-audience');
        const audienceResult = await audienceResponse.json();
        
        console.log('Audience API Response:', audienceResult);
        
        if (audienceResult.success) {
          setTargetAudience(audienceResult.data);
          console.log('Цільова аудиторія встановлена:', audienceResult.data);
        } else {
          console.error('Audience API повернув помилку:', audienceResult.message);
        }

        // Завантажуємо програму курсу
        console.log('Завантаження програми курсу...');
        const programResponse = await fetch('/api/courses/1/program');
        const programResult = await programResponse.json();
        
        console.log('Program API Response:', programResult);
        
        if (programResult.success) {
          setCourseProgram(programResult.data);
          console.log('Програма курсу встановлена:', programResult.data);
        } else {
          console.error('Program API повернув помилку:', programResult.message);
        }
        
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
      } finally {
        console.log('Завершення завантаження, встановлюємо isLoading = false');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Course structured data
  const flagshipCourseData = courseSchema({
    name: courseData.mainTitle,
    description: courseData.description1,
    price: courseData.price
  });

  const purchaseCourseData = {
    id: 1,
    title: `${courseData.mainTitle} - ${courseData.subtitle}`,
    price: `${courseData.price} ГРН`,
    oldPrice: `${courseData.oldPrice} ГРН`
  };

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

  // Touch event handlers for swipe functionality
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Функція для групування програми за модулями
  const groupProgramByModules = () => {
    const modules = {};
    courseProgram.forEach(item => {
      if (!modules[item.module_number]) {
        modules[item.module_number] = {
          module_title: item.module_title,
          module_description: item.module_description,
          lessons: []
        };
      }
      
      if (item.lesson_number !== null) {
        modules[item.module_number].lessons.push({
          lesson_number: item.lesson_number,
          lesson_title: item.lesson_title,
          lesson_description: item.lesson_description,
          is_practical: item.is_practical
        });
      }
    });
    
    return modules;
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        fontFamily: 'Bender, system-ui, sans-serif'
      }}>
        Завантаження...
      </div>
    );
  }

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
      <main ref={mainRef} className="la-flagship-main">
        <div className="la-flagship-main__inner">
          {courseData.featured_image && (
            <div className="la-flagship-content__hero-image">
              <img src={courseData.featured_image} alt={courseData.mainTitle} />
            </div>
          )}
          <section className="la-flagship-content">
            <div className="la-flagship-content__header">
              <span className="la-flagship-content__label">ПРОГРАМА</span>
              <h1 className="la-flagship-content__title">{courseData.mainTitle}</h1>
              <h2 className="la-flagship-content__subtitle">{courseData.subtitle}</h2>
            </div>
            
            <div className="la-flagship-content__description la-flagship-content__description--md">
              {courseData.description1 && (
                <div className="la-flagship-content__text">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{courseData.description1}</ReactMarkdown>
                </div>
              )}
              {courseData.description2 && (
                <div className="la-flagship-content__text">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{courseData.description2}</ReactMarkdown>
                </div>
              )}
            </div>

            <button 
              className="la-flagship-content__button"
              onClick={() => setIsPurchaseModalOpen(true)}
            >
              <span>ЗАПИСАТИСЯ НА КУРС</span>
              <div className="la-flagship-content__button-arrow">
                <span></span>
              </div>
            </button>
          </section>
        </div>
      </main>

      {/* Students Carousel Section */}
      <section ref={studentsRef} className="la-flagship-students">
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
            <div 
              className="la-flagship-students__carousel-container"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
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
      <section ref={infoRef} className="la-flagship-course-info">
        <div className="la-flagship-course-info__inner">
          <div className="la-flagship-course-info__details">
              <div className="la-flagship-course-info__item">
                <h3 className="la-flagship-course-info__label">ДОСВІД</h3>
                <p className="la-flagship-course-info__text">{courseData.experience || '—'}</p>
              </div>
            <div className="la-flagship-course-info__item">
              <h3 className="la-flagship-course-info__label">СТАРТ</h3>
              <p className="la-flagship-course-info__text">{courseData.startDate}</p>
            </div>
              <div className="la-flagship-course-info__item">
                <h3 className="la-flagship-course-info__label">ГРУПА</h3>
                <p className="la-flagship-course-info__text">{courseData.group_info || '—'}</p>
            </div>
            <div className="la-flagship-course-info__item">
              <h3 className="la-flagship-course-info__label">ТРИВАЛІСТЬ</h3>
              <p className="la-flagship-course-info__text">{courseData.duration}</p>
            </div>
          </div>
          
          <div className="la-flagship-course-info__stats">
            <div className="la-flagship-course-info__stat">
              <span className="la-flagship-course-info__number">{courseData.themes.split(' ')[0]}</span>
              <span className="la-flagship-course-info__stat-label">{courseData.themes.split(' ')[1]}</span>
            </div>
            <div className="la-flagship-course-info__stat">
              <span className="la-flagship-course-info__number">{courseData.modules.split(' ')[0]}</span>
              <span className="la-flagship-course-info__stat-label">{courseData.modules.split(' ')[1]}</span>
            </div>
            <div className="la-flagship-course-info__stat">
              <span className="la-flagship-course-info__number">{courseData.duration.split(' ')[0]}</span>
              <span className="la-flagship-course-info__stat-label">{courseData.duration.split(' ')[1]}</span>
            </div>
            <div className="la-flagship-course-info__stat">
              <span className="la-flagship-course-info__number">{courseData.curators.split(' ')[0]}</span>
              <span className="la-flagship-course-info__stat-label">{courseData.curators.split(' ')[1]}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Order Section */}
      <section id="la-flagship-order" ref={orderRef} className="la-flagship-order">
        <div className="la-flagship-order__inner">
          <p className="la-flagship-order__text">
            ЗАПИШІТЬСЯ ЗАРАЗ І ПОЧНІТЬ РЕАЛІЗОВУВАТИ СВОЇ ПРОФЕСІЙНІ АМБІЦІЇ З НАМИ. ЧАС РОБИТИ КРОК ВПЕРЕД — JUST DO IT.
          </p>
          
          <div className="la-flagship-order__card">
            <h2 className="la-flagship-order__title">{courseData.mainTitle}</h2>
            <p className="la-flagship-order__start-date">СТАРТ {courseData.startDate}</p>
            
            <div className="la-flagship-order__pricing">
              <span className="la-flagship-order__old-price">{courseData.oldPrice} ГРН</span>
              <span className="la-flagship-order__new-price">{courseData.price} ГРН</span>
            </div>
            
            <button 
              className="la-flagship-order__button"
              onClick={() => setIsPurchaseModalOpen(true)}
            >
              ЗАМОВИТИ
            </button>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section ref={targetRef} className="la-flagship-target">
        <div className="la-flagship-target__inner">
            <h2 className="la-flagship-target__title">ДЛЯ КОГО ЦЕЙ КУРС?</h2>
        </div>

        <div className="la-flagship-target__line"></div>
        <div className="la-flagship-target__inner">  
          <div className="la-flagship-target__content">
            <div className="la-flagship-target__list">
              {targetAudience.map((item, index) => (
                <div key={item.id} className="la-flagship-target__item">
                  <span className="la-flagship-target__number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="la-flagship-target__text">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="la-flagship-target__block">
              <Image
                src="/target-1.png"
                alt="Target audience visual"
                width={684}
                height={453}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
        
      </section>

      {/* Author Section */}
      <section ref={authorRef} className="la-flagship-author">
        <div className="la-flagship-author__inner">
          <div className="la-flagship-author__left">
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
            <div className="la-flagship-author__photo-mobile">
              {courseData.authorPhoto ? (
                <img
                  src={courseData.authorPhoto}
                  alt={courseData.authorName}
                  className="la-flagship-author__image"
                />
              ) : (
                <Image
                  src="/author-photo.png"
                  alt={courseData.authorName}
                  width={611}
                  height={833}
                  className="la-flagship-author__image"
                />
              )}
            </div>
            
            <div className="la-flagship-author__content">
              <div className="la-flagship-author__info">
                <h2 className="la-flagship-author__name">{courseData.authorName}</h2>
                
                <div className="la-flagship-author__description">
                  <p className="la-flagship-author__text">
                    {courseData.authorBio1}
                  </p>
                  {courseData.authorBio2 && (
                    <p className="la-flagship-author__text">
                      {courseData.authorBio2}
                    </p>
                  )}
                </div>
                
                <div className="la-flagship-author__buttons">
                  <a href="#contact" className="la-flagship-author__button">ЗВ&apos;ЯЗАТИСЯ</a>
                  <a href="#la-flagship-course-program" className="la-flagship-author__button">ПРО КУРС</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="la-flagship-author__photo">
            {courseData.authorPhoto ? (
              <img
                src={courseData.authorPhoto}
                alt={courseData.authorName}
                className="la-flagship-author__image"
              />
            ) : (
              <Image
                src="/author-photo.png"
                alt={courseData.authorName}
                width={611}
                height={833}
                className="la-flagship-author__image"
              />
            )}
          </div>
        </div>
      </section>

      <section ref={skillsRef} className="la-flagship-skills">
        <div className="la-flagship-skills__inner">
            <h2 className="la-flagship-skills__title">навички які ви зможете опанувати:</h2>
        </div>

        <div className="la-flagship-skills__line"></div>

        <div className="la-flagship-skills__inner">
          <ul className="la-flagship-skills__list">
            {courseData.skills ? courseData.skills.split('\n').filter(skill => skill.trim()).map((skill, index) => (
              <li key={index} className="la-flagship-skills__item">
                {skill.trim()}
              </li>
            )) : (
              <>
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
              </>
            )}
          </ul>
        </div>

        <div className="la-flagship-skills__line"></div>

      
      </section>

      {/* Contact Questions Section */}
      <section ref={questionsRef} className="la-flagship-contact-questions">
        <div className="la-flagship-contact-questions__inner">
          <div className="la-flagship-contact-questions__block">
            <Image
              src="/question_photo.png"
              alt="Питання"
              width={133}
              height={133}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="la-flagship-contact-questions__content">
            <h2 className="la-flagship-contact-questions__text">ВІДПОВІМО ВАМ НА ВСІ ПИТАННЯ</h2>
            <div className="la-flagship-contact-questions__buttons">
              <a href="tel:+380956301304" className="la-flagship-contact-questions__button">ЗАТЕЛЕФОНУЙТЕ НАМ</a>
              <a href="https://t.me/komarkaterinamarketing" target="_blank" rel="noopener noreferrer" className="la-flagship-contact-questions__button">НАПИСАТИ В TELEGRAM</a>
            </div>
          </div>
        </div>
      </section>

      {/* Course Program Section */}
      <section id="la-flagship-course-program" ref={programRef} className="la-course-program">
        <div className="la-course-program__inner">
          <div className="la-course-program__header">
            <div className="la-course-program__left">
              <p className="la-course-program__motto">
                ВІД ІДЕЇ ДО
                РЕАЛЬНОСТІ, <br />ВІД МРІЇ ДО ДІЇ.
              </p>
            </div>
            <div className="la-course-program__right">
              <h2 className="la-course-program__title">{courseData.mainTitle} : {courseData.subtitle}</h2>
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
              {Object.keys(groupProgramByModules()).sort((a, b) => parseInt(a) - parseInt(b)).map(moduleNumber => {
                const moduleData = groupProgramByModules()[moduleNumber];
                return (
                  <React.Fragment key={moduleNumber}>
              <div className="la-course-program__line"></div>
              
              <div className="la-course-program__inner">
                <div className="la-course-program__content">
                  <div className="la-course-program__module">
                    <div className="la-course-program__module-info">
                            <h4 className="la-course-program__module-number">{moduleData.module_title}</h4>
                            <h5 className="la-course-program__module-title">{moduleData.module_description}</h5>
                    </div>
                  
                    <div className="la-course-program__lessons">
                      <ul className="la-course-program__lesson-list">
                              {moduleData.lessons.map((lesson, index) => (
                                <li key={index} className="la-course-program__lesson">
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
              })}
            </>
          )}
        
        <div className="la-course-program__line"></div>
      </section>

      <Contact />
      <Footer />

      {/* Purchase Modal */}
      <CoursePurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        courseData={purchaseCourseData}
      />
    </>
  );
};

export default FlagshipPage;