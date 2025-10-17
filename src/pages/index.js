import React, { useState, useEffect, useMemo } from "react";
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

function toDateOnly(dateLike) {
  const d = new Date(dateLike);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatRange(startDate, endDate) {
  const s = new Date(startDate);
  const e = new Date(endDate);
  const fmt = (d) =>
    d.toLocaleDateString("uk-UA", { day: "2-digit", month: "long", year: "numeric" });
  if (s.toDateString() === e.toDateString()) return fmt(s);
  return (
    s.toLocaleDateString("uk-UA", { day: "2-digit", month: "long" }) +
    " – " +
    fmt(e)
  );
}

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

// Program Card Component
const ProgramCard = ({ title, subtitle, delay = "" }) => {
  const [cardRef, cardVisible] = useScrollAnimation({ threshold: 0.2 });
  
  return (
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
          <span className="la-blog__description">[{blog.tag}]</span>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const homeSEO = pagesSEO.home;
  const [eventsRef, eventsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [programsRef, programsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [libraryRef, libraryVisible] = useScrollAnimation({ threshold: 0.1 });
  const [contactRef, contactVisible] = useScrollAnimation({ threshold: 0.1 });
  
  // Combine structured data schemas
  const structuredData = [organizationSchema, websiteSchema];

  // Calendar state
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?active=true');
        const result = await response.json();
        
        if (result.success) {
          setEvents(result.data);
        }
      } catch (error) {
        console.error('Помилка завантаження подій:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blog?published=true');
        const result = await response.json();
        
        if (result.success) {
          setFeaturedBlogs(result.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Помилка завантаження блогів:', error);
      }
    };

    fetchBlogs();
  }, []);

  const defaultEvent = useMemo(() => {
    if (events.length === 0) return null;
    
    const upcoming = [...events]
      .map((e) => ({ ...e, start: toDateOnly(e.startDate) }))
      .filter((e) => e.start >= today)
      .sort((a, b) => a.start - b.start)[0];
    return upcoming || events[0];
  }, [today, events]);

  const [selectedEventId, setSelectedEventId] = useState(defaultEvent?.id);

  useEffect(() => {
    if (defaultEvent && !selectedEventId) {
      setSelectedEventId(defaultEvent.id);
    }
  }, [defaultEvent, selectedEventId]);

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
      const date = new Date(viewYear, viewMonth, day);
      date.setHours(0, 0, 0, 0);
      const dayEvents = events.filter((ev) => {
        const s = toDateOnly(ev.startDate);
        const e = toDateOnly(ev.endDate);
        return date >= s && date <= e;
      });
      return { key: `d-${day}`, day, date, events: dayEvents };
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

  const goPrevBlog = () => {
    setCurrentBlogIndex((prev) => 
      prev === 0 ? featuredBlogs.length - 1 : prev - 1
    );
  };

  const goNextBlog = () => {
    setCurrentBlogIndex((prev) => 
      prev === featuredBlogs.length - 1 ? 0 : prev + 1
    );
  };

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
                          <h3 className="la-event-card__title">{selectedEvent.title}</h3>
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
                          <p className="la-event-card__desc">{selectedEvent.description}</p>
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
                      const isToday = cell.date.getTime() === today.getTime();
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
                            if (hasEvents) setSelectedEventId(cell.events[0].id);
                          }}
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
        <section ref={programsRef} className={`la-programs animate-fade-in-up ${programsVisible ? 'is-visible' : ''}`} aria-label="Навчальні програми">
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

            <div className="la-programs__grid">
              <ProgramCard title="Landscaper 5.0" subtitle="Перетвори хобі у бізнес" delay="animate-delay-100" />
              <ProgramCard title="ШІ рендер на телефоні" subtitle="Від ескізу до WOW за 5 хвилин" delay="animate-delay-200" />
              <ProgramCard
                title="Метод роботи практикуючого ландшафтного дизайнера"
                subtitle="Або в чому секрет виходу на високий чек"
                delay="animate-delay-300"
              />
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

            <div className="la-library__carousel">
              {featuredBlogs.length > 0 && featuredBlogs.map((blog, index) => (
                <div 
                  key={blog.id}
                  className={`la-library__slide ${index === currentBlogIndex ? 'la-library__slide--active' : ''}`}
                >
                  <Link href={`/blog/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <BlogCard 
                      blog={blog}
                      delay=""
                    />
                  </Link>
                </div>
              ))}
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
