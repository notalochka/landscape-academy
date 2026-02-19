import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import SEO from "../components/SEO/SEO";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";
import useScrollAnimation from "../hooks/useScrollAnimation";
import EventRegistrationModal from "../components/EventRegistrationModal/EventRegistrationModal";
import { pagesSEO, organizationSchema, websiteSchema } from "../config/seo";

/** Дефолтне зображення для блогів без фото (public/og-blog.jpg) */
const DEFAULT_BLOG_IMAGE = '/og-blog.jpg';

function toDateOnly(dateLike) {
  if (!dateLike) return null;
  try {
    const d = new Date(dateLike);
    if (isNaN(d.getTime())) {
      console.warn('Invalid date:', dateLike);
      return null;
    }
    // Використовуємо UTC для правильного порівняння дат
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const day = d.getUTCDate();
    return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  } catch (error) {
    console.error('Error parsing date:', dateLike, error);
    return null;
  }
}

function formatRange(startDate, endDate) {
  if (!startDate || !endDate) {
    console.warn('Missing dates:', { startDate, endDate });
    return 'Дата не вказана';
  }
  
  try {
    const s = new Date(startDate);
    const e = new Date(endDate);
    
    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      console.warn('Invalid dates:', { startDate, endDate });
      return 'Невалідна дата';
    }
    
    // Використовуємо UTC для правильного визначення дати
    const sYear = s.getUTCFullYear();
    const sMonth = s.getUTCMonth();
    const sDay = s.getUTCDate();
    
    const eYear = e.getUTCFullYear();
    const eMonth = e.getUTCMonth();
    const eDay = e.getUTCDate();
    
    // Створюємо локальні дати для форматування (але з правильними UTC значеннями)
    const sLocal = new Date(sYear, sMonth, sDay);
    const eLocal = new Date(eYear, eMonth, eDay);
    
    const fmt = (d) =>
      d.toLocaleDateString("uk-UA", { day: "2-digit", month: "long", year: "numeric" });
    
    // Порівнюємо UTC дати
    if (sYear === eYear && sMonth === eMonth && sDay === eDay) {
      return fmt(sLocal);
    }
    
    return (
      sLocal.toLocaleDateString("uk-UA", { day: "2-digit", month: "long" }) +
      " – " +
      fmt(eLocal)
    );
  } catch (error) {
    console.error('Error formatting date range:', error);
    return 'Помилка форматування дати';
  }
}

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

// Program Card Component
const ProgramCard = ({ title, subtitle, delay = "", href = null }) => {
  const [cardRef, cardVisible] = useScrollAnimation({ threshold: 0.2 });
  
  const cardContent = (
    <div 
      ref={cardRef}
      className={`la-program__card hover-lift animate-fade-in-up ${delay} ${cardVisible ? 'is-visible' : ''}`}
    >
      <h3 className="la-program__title">{title}</h3>
      <p className="la-program__subtitle">{subtitle}</p>
      <div className="la-program__arrow" aria-hidden>
        <span />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="la-program__link">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

// Blog Card Component
const BlogCard = ({ blog, delay = "" }) => {
  const [cardRef, cardVisible] = useScrollAnimation({ threshold: 0.2 });
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { 
      day: '2-digit', 
      month: 'long'
    }).toLowerCase();
  };
  
  return (
    <div 
      ref={cardRef}
      className={`la-blog__card hover-lift animate-scale-in ${delay} ${cardVisible ? 'is-visible' : ''}`}
    >
      <div className="la-blog__content">
        <h3 className="la-blog__title">{blog.title}</h3>
        <div className="la-blog__footer">
          <span className="la-blog__date">{formatDate(blog.createdAt)}</span>
          <span className="la-blog__description">[{blog.tag || ''}]</span>
        </div>
        <span className="la-blog__more">
          Дізнатися більше
          <span className="la-blog__more-arrow" aria-hidden>→</span>
        </span>
      </div>
    </div>
  );
};

export default function Home({ events: initialEvents = [], blogs: initialBlogs = [], courses: initialCourses = [] }) {
  const homeSEO = pagesSEO.home;
  const [eventsRef, eventsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [programsRef, programsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [libraryRef, libraryVisible] = useScrollAnimation({ threshold: 0.1 });
  const [contactRef, contactVisible] = useScrollAnimation({ threshold: 0.1 });
  
  // Структуровані дані для SEO (використовуємо @graph для кількох схем)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      websiteSchema
    ]
  };

  // Calendar state
  const today = useMemo(() => {
    const d = new Date();
    // Використовуємо UTC для правильного порівняння з датами подій
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const day = d.getUTCDate();
    return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  }, []);

  const [viewYear, setViewYear] = useState(today.getUTCFullYear());
  const [viewMonth, setViewMonth] = useState(today.getUTCMonth());
  const [events, setEvents] = useState(initialEvents);
  const [isLoading, setIsLoading] = useState(false); // Дані вже завантажені через ISR
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featuredBlogs, setFeaturedBlogs] = useState(initialBlogs);
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0);
  const [programCourses, setProgramCourses] = useState(initialCourses);
  const libraryCarouselRef = useRef(null);
  const LIBRARY_GAP = 30;

  // Дані завантажуються через getStaticProps (ISR) для швидшого завантаження

  const defaultEvent = useMemo(() => {
    if (events.length === 0) return null;
    
    // Фільтруємо події з валідними датами
    const validEvents = events
      .map((e) => {
        const start = toDateOnly(e.startDate);
        const end = toDateOnly(e.endDate);
        return { ...e, start, end };
      })
      .filter((e) => e.start !== null && e.end !== null);
    
    if (validEvents.length === 0) return null;
    
    // Знаходимо найближчу майбутню подію
    const upcoming = validEvents
      .filter((e) => e.end >= today) // Подія ще не закінчилася
      .sort((a, b) => a.start - b.start)[0];
    
    // Якщо немає майбутніх, показуємо останню подію
    return upcoming || validEvents.sort((a, b) => b.start - a.start)[0];
  }, [today, events]);

  const [selectedEventId, setSelectedEventId] = useState(defaultEvent?.id);
  const initialCalendarSynced = useRef(false);

  useEffect(() => {
    if (defaultEvent && !selectedEventId) {
      setSelectedEventId(defaultEvent.id);
    }
  }, [defaultEvent, selectedEventId]);

  // Встановлюємо календар на місяць найближчої події лише один раз при завантаженні (не скидаємо після ручного гортання)
  useEffect(() => {
    if (initialCalendarSynced.current || events.length === 0 || !defaultEvent?.start) return;
    initialCalendarSynced.current = true;
    const eventYear = defaultEvent.start.getUTCFullYear();
    const eventMonth = defaultEvent.start.getUTCMonth();
    setViewYear(eventYear);
    setViewMonth(eventMonth);
  }, [events, defaultEvent]);

  const monthLabel = useMemo(() => {
    return new Date(viewYear, viewMonth)
      .toLocaleDateString("uk-UA", {
        month: "long",
        year: "numeric",
      })
      .replace(" р.", "");
  }, [viewMonth, viewYear]);

  const daysGrid = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate();
    const weekday = (first.getDay() + 6) % 7;
    const leading = Array.from({ length: weekday }).map((_, i) => ({ key: `e-${i}` }));
    const days = Array.from({ length: lastDay }).map((_, i) => {
      const day = i + 1;
      // Використовуємо UTC для правильного порівняння з датами подій
      const dateUTC = new Date(Date.UTC(viewYear, viewMonth, day, 0, 0, 0, 0));
      const dayEvents = events.filter((ev) => {
        const s = toDateOnly(ev.startDate);
        const e = toDateOnly(ev.endDate);
        // Перевіряємо, чи обидві дати валідні
        if (s === null || e === null) {
          return false;
        }
        // Перевіряємо, чи дата потрапляє в діапазон події (включно з початком і кінцем)
        return dateUTC >= s && dateUTC <= e;
      });
      // Створюємо локальну дату для відображення
      const localDate = new Date(viewYear, viewMonth, day);
      localDate.setHours(0, 0, 0, 0);
      return { key: `d-${day}`, day, date: localDate, events: dayEvents };
    });
    return [...leading, ...days];
  }, [viewMonth, viewYear, events]);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || defaultEvent;

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  };

  const goNext = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  };

  const scrollLibraryToIndex = (index) => {
    const el = libraryCarouselRef.current;
    if (!el || featuredBlogs.length === 0) return;
    const slide = el.querySelector(".la-library__slide");
    if (!slide) return;
    const slideWidth = slide.offsetWidth;
    el.scrollTo({ left: index * (slideWidth + LIBRARY_GAP), behavior: "smooth" });
    setCurrentBlogIndex(index);
  };

  const goPrevBlog = () => {
    const next = currentBlogIndex === 0 ? featuredBlogs.length - 1 : currentBlogIndex - 1;
    scrollLibraryToIndex(next);
  };

  const goNextBlog = () => {
    const next = currentBlogIndex === featuredBlogs.length - 1 ? 0 : currentBlogIndex + 1;
    scrollLibraryToIndex(next);
  };

  useEffect(() => {
    const el = libraryCarouselRef.current;
    if (!el) return;
    const onScroll = () => {
      const slide = el.querySelector(".la-library__slide");
      if (!slide) return;
      const slideWidth = slide.offsetWidth;
      const index = Math.round(el.scrollLeft / (slideWidth + LIBRARY_GAP));
      const clamped = Math.max(0, Math.min(index, featuredBlogs.length - 1));
      setCurrentBlogIndex(clamped);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [featuredBlogs.length]);

  return (
    <>
      <SEO
        title={homeSEO.title}
        description={homeSEO.description}
        keywords={homeSEO.keywords}
        ogImage={homeSEO.ogImage}
        canonical={homeSEO.canonical}
        structuredData={structuredData}
      />
      <div>
        <Header />
        <Hero />

        {/* Events Calendar Section */}
        <section ref={eventsRef} className={`la-events-calendar animate-fade-in-up ${eventsVisible ? 'is-visible' : ''}`} id="events">
          <div className="la-events-calendar__inner">
            <div className="la-events-calendar__header">
              <Image
                className="la-events-calendar__logo"
                src="/logo_academy.png"
                alt="Landscape Academy"
                width={150}
                height={150}
                style={{ objectFit: 'contain' }}
              />
              <span className="la-events-calendar__title">Календар подій</span>
            </div>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Завантаження подій...
              </div>
            ) : (
              <div className="la-events-calendar__grid">
                <div className="la-event-section">
                  {selectedEvent ? (
                    <>
                      <div className="la-event-card">
                        {selectedEvent.image && (
                          <div className="la-event-card__image">
                            <Image
                              src={selectedEvent.image}
                              alt={selectedEvent.title}
                              width={640}
                              height={360}
                            />
                          </div>
                        )}
                        <div className="la-event-card__content">
                          <h3 className="la-event-card__title" style={{ textTransform: 'none' }}>{selectedEvent.title}</h3>
                          <div className="la-event-card__dates">
                            {formatRange(selectedEvent.startDate, selectedEvent.endDate)}
                          </div>
                          {selectedEvent.time && (
                            <div className="la-event-card__time">{selectedEvent.time}</div>
                          )}
                          {selectedEvent.eventType === 'online' ? (
                            <div className="la-event-card__location">Онлайн</div>
                          ) : selectedEvent.location ? (
                            <div className="la-event-card__location">{selectedEvent.location}</div>
                          ) : null}
                          {selectedEvent.price && (
                            <div className="la-event-card__price">
                              {selectedEvent.price.toLowerCase().includes('безкоштовно') 
                                ? selectedEvent.price 
                                : `${selectedEvent.price.replace(/грн/gi, '').trim()} ₴`}
                            </div>
                          )}
                          <div 
                            className="la-event-card__desc"
                            style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}
                          >
                            {selectedEvent.description}
                          </div>
                        </div>
                      </div>
                      <div className="la-event-cta">
                        <button 
                          onClick={() => setIsModalOpen(true)} 
                          className="la-event-cta__btn"
                        >
                          Записатися на подію
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      Найближчих подій немає
                    </div>
                  )}
                </div>
                <div className="la-calendar">
                  <div className="la-calendar__header">
                    <button type="button" className="la-calendar__nav" onClick={goPrev}>
                      ←
                    </button>
                    <div className="la-calendar__month">{monthLabel}</div>
                    <button type="button" className="la-calendar__nav" onClick={goNext}>
                      →
                    </button>
                  </div>
                  <div className="la-calendar__weekdays">
                    {WEEKDAYS.map((w) => (
                      <div key={w} className="la-calendar__weekday">
                        {w}
                      </div>
                    ))}
                  </div>
                  <div className="la-calendar__days">
                    {daysGrid.map((cell) => {
                      if (!cell.day) return <div key={cell.key} className="la-calendar__empty" />;
                      const hasEvents = cell.events && cell.events.length > 0;
                      
                      // Порівнюємо UTC дати для правильної перевірки "сьогодні"
                      const cellDateUTC = new Date(Date.UTC(
                        cell.date.getFullYear(),
                        cell.date.getMonth(),
                        cell.date.getDate(),
                        0, 0, 0, 0
                      ));
                      const isToday = cellDateUTC.getTime() === today.getTime();
                      
                      return (
                        <button
                          key={cell.key}
                          type="button"
                          className={[
                            "la-calendar__day",
                            hasEvents ? "la-calendar__day--events" : "",
                            isToday ? "la-calendar__day--today" : "",
                          ].join(" ")}
                          onClick={() => {
                            if (hasEvents && cell.events.length > 0) {
                              setSelectedEventId(cell.events[0].id);
                              // Прокручуємо до секції події для кращого UX
                              document.getElementById('events')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                          style={{ cursor: hasEvents ? 'pointer' : 'default' }}
                          title={hasEvents ? cell.events.map(e => e.title).join(', ') : ''}
                        >
                          <span>{cell.day}</span>
                          {hasEvents && <span className="la-calendar__dot" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Programs Section */}
        <section ref={programsRef} id="programs" className={`la-programs animate-fade-in-up ${programsVisible ? 'is-visible' : ''}`} aria-label="Навчальні програми">
          <div className="la-programs__inner">
            <div className="la-programs__header">
              <Image
                className="la-programs__logo"
                src="/logo_academy.png"
                alt="Landscape Academy"
                width={150}
                height={150}
                style={{ objectFit: 'contain' }}
              />
              <span className="la-programs__eyebrow">Навчальні програми</span>
            </div>

            <div id="programs-grid" className="la-programs__grid">
              {programCourses.map((course, idx) => {
                const href = course.course_type === 'flagship'
                  ? '/flagship'
                  : course.course_type === 'course-1'
                  ? '/course-1'
                  : course.course_type === 'course-2'
                  ? '/course-2'
                  : `/courses/${course.id}`;
                const delays = ['animate-delay-100', 'animate-delay-200', 'animate-delay-300'];
                const delay = delays[idx] || '';
                return (
                  <ProgramCard
                    key={course.id}
                    title={course.title}
                    subtitle={course.subtitle || ''}
                    delay={delay}
                    href={href}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Library Section */}
        <section ref={libraryRef} className={`la-library animate-fade-in-up ${libraryVisible ? 'is-visible' : ''}`} aria-label="Бібліотека корисних матеріалів">
          <div className="la-library__inner">
            <div className="la-library__header">
              <Image
                className="la-library__logo"
                src="/logo_academy.png"
                alt="Landscape Academy"
                width={150}
                height={150}
                style={{ objectFit: 'contain' }}
              />
              <span className="la-library__eyebrow">БІБЛІОТЕКА КОРИСНИХ МАТЕРІАЛІВ</span>
            </div>

            <div
              ref={libraryCarouselRef}
              className="la-library__carousel"
              role="region"
              aria-label="Карусель блогів"
            >
              {featuredBlogs.length > 0 && featuredBlogs.map((blog, index) => {
                const img = blog.featured_image?.trim() || blog.image?.trim();
                const bgImage = img ? (img.startsWith('/uploads/') ? `/api${img}` : img) : DEFAULT_BLOG_IMAGE;
                return (
                  <div 
                    key={blog.id}
                    className={`la-library__slide ${index === currentBlogIndex ? 'la-library__slide--active' : ''}`}
                  >
                    <div 
                      className="la-library__slide-bg" 
                      style={{ backgroundImage: `url(${bgImage})` }}
                      aria-hidden
                    />
                    <Link href={`/blog/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }} className="la-library__slide-link">
                      <BlogCard 
                        blog={blog}
                        delay=""
                      />
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="la-library__navigation">
              <button 
                className="la-library__arrow la-library__arrow--left"
                onClick={goPrevBlog}
                aria-label="Попередній блог"
              >
                <span></span>
              </button>
              <button 
                className="la-library__arrow la-library__arrow--right"
                onClick={goNextBlog}
                aria-label="Наступний блог"
              >
                <span></span>
              </button>
            </div>
            {featuredBlogs.length > 0 && (
              <div className="la-library__dots" role="tablist" aria-label="Індикатори слайдів">
                {featuredBlogs.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={index === currentBlogIndex}
                    aria-label={`Слайд ${index + 1}`}
                    className={`la-library__dot ${index === currentBlogIndex ? 'la-library__dot--active' : ''}`}
                    onClick={() => scrollLibraryToIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <div ref={contactRef} className={`animate-fade-in-up ${contactVisible ? 'is-visible' : ''}`}>
          <Contact />
        </div>
        <Footer />
      </div>

      <EventRegistrationModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

// Статична генерація головної сторінки з ISR
export async function getStaticProps() {
  try {
    // Імпортуємо базу даних напряму
    const db = require('../lib/database');
    
    // Отримуємо активні події
    const eventsRaw = db.prepare('SELECT * FROM events WHERE is_active = 1 ORDER BY start_date ASC').all();
    
    // Форматуємо події для правильного відображення
    const formatDate = (dateString) => {
      if (!dateString) return null;
      try {
        if (dateString.includes('T') || dateString.includes('Z')) {
          const date = new Date(dateString);
          return isNaN(date.getTime()) ? null : date.toISOString();
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString.trim())) {
          const date = new Date(dateString + 'T00:00:00.000Z');
          return isNaN(date.getTime()) ? null : date.toISOString();
        }
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date.toISOString();
      } catch (error) {
        console.error('Error parsing date in getStaticProps:', dateString, error);
        return null;
      }
    };
    
    const events = eventsRaw.map(event => {
      const startDate = event.start_date || event.date;
      const endDate = event.end_date || event.date;
      
      return {
        ...event,
        isActive: event.is_active === 1,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        createdAt: event.created_at,
        time: event.time || '10:00',
        location: event.location || 'Онлайн',
        price: event.price || 'Безкоштовно',
        eventType: event.location && event.location !== 'Онлайн' ? 'offline' : 'online'
      };
    }).filter(event => event.startDate && event.endDate);
    
    // Функція для підрахунку часу читання
    const calculateReadTime = (content) => {
      const wordsPerMinute = 200;
      const words = (content || '').trim().split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      return `${minutes} хв читання`;
    };
    
    // Отримуємо всі опубліковані блоги для бібліотеки на головній
    const blogsRaw = db.prepare('SELECT * FROM blogs WHERE published = 1 ORDER BY created_at DESC').all();
    
    // Форматуємо блоги
    const blogs = blogsRaw.map(blog => ({
      ...blog,
      readTime: calculateReadTime(blog.content || ''),
      isPublished: blog.published === 1,
      createdAt: blog.created_at,
      image: blog.featured_image || blog.image || null,
      tag: blog.tag || null
    }));
    
    // Отримуємо перші 3 курси для секції програм
    const courses = db.prepare('SELECT * FROM courses WHERE is_active = 1 ORDER BY id ASC LIMIT 3').all();
    
    return {
      props: {
        events: events || [],
        blogs: blogs || [],
        courses: courses || []
      },
      // Перегенеруємо сторінку кожні 5 хвилин
      revalidate: 300
    };
  } catch (error) {
    console.error('Error in getStaticProps for home:', error);
    return {
      props: {
        events: [],
        blogs: [],
        courses: []
      },
      revalidate: 300
    };
  }
}
