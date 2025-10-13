import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./EventsCalendar.module.css";
import EventRegistrationModal from "../EventRegistrationModal/EventRegistrationModal";

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

export default function EventsCalendar() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-11
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Завантажити події з API
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

  // Оберіть найближчу подію за замовчанням
  const defaultEvent = useMemo(() => {
    if (events.length === 0) return null;
    
    const upcoming = [...events]
      .map((e) => ({ ...e, start: toDateOnly(e.startDate) }))
      .filter((e) => e.start >= today)
      .sort((a, b) => a.start - b.start)[0];
    return upcoming || events[0];
  }, [today, events]);

  const [selectedEventId, setSelectedEventId] = useState(defaultEvent?.id);

  // Оновити вибрану подію коли завантажаться дані
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
    // Перенесення початку на Пн (0) → Пн як 0, Нд як 6
    const weekday = (first.getDay() + 6) % 7; // 0..6, де 0 — Пн
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

  if (isLoading) {
    return (
      <section className={styles.eventsCalWrap} id="events">
        <div className={styles.eventsCalInner}>
          <div className={styles.eventsCalHeader}>
            <Image
              className={styles.eventsCalLogo}
              src="/logo_academy.png"
              alt="Landscape Academy"
              width={150}
              height={150}
              style={{ objectFit: 'contain' }}
            />
            <span className={styles.eventsCalTitle}>Календар подій</span>
          </div>
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Завантаження подій...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.eventsCalWrap} id="events">
      <div className={styles.eventsCalInner}>
        <div className={styles.eventsCalHeader}>
          <Image
            className={styles.eventsCalLogo}
            src="/logo_academy.png"
            alt="Landscape Academy"
            width={150}
            height={150}
            style={{ objectFit: 'contain' }}
          />
          <span className={styles.eventsCalTitle}>Календар подій</span>
        </div>
        <div className={styles.eventsCalGrid}>
        <div className={styles.eventSection}>
          {selectedEvent ? (
            <>
              <div className={styles.card}>
                {selectedEvent.image && (
                  <div className={styles.image}>
                    <Image
                      src={selectedEvent.image}
                      alt={selectedEvent.title}
                      width={640}
                      height={360}
                    />
                  </div>
                )}
                <div className={styles.content}>
                  <h3 className={styles.eventTitle}>{selectedEvent.title}</h3>
                  <div className={styles.dates}>
                    {formatRange(selectedEvent.startDate, selectedEvent.endDate)}
                  </div>
                  {selectedEvent.time && (
                    <div className={styles.time}>{selectedEvent.time}</div>
                  )}
                  {selectedEvent.eventType === 'online' ? (
                    <div className={styles.location}>Онлайн</div>
                  ) : selectedEvent.location ? (
                    <div className={styles.location}>{selectedEvent.location}</div>
                  ) : null}
                  {selectedEvent.price && (
                    <div className={styles.price}>
                      {selectedEvent.price.toLowerCase().includes('безкоштовно') 
                        ? selectedEvent.price 
                        : `${selectedEvent.price.replace(/грн/gi, '').trim()} ₴`}
                    </div>
                  )}
                  <p className={styles.desc}>{selectedEvent.description}</p>
                </div>
              </div>
              <div className={styles.cta}>
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className={styles.btn}
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
        <div className={styles.calendar}>
          <div className={styles.calHeader}>
            <button type="button" className={styles.nav} onClick={goPrev}>
              ←
            </button>
            <div className={styles.month}>{monthLabel}</div>
            <button type="button" className={styles.nav} onClick={goNext}>
              →
            </button>
          </div>
          <div className={styles.weekdays}>
            {WEEKDAYS.map((w) => (
              <div key={w} className={styles.weekday}>
                {w}
              </div>
            ))}
          </div>
          <div className={styles.days}>
            {daysGrid.map((cell) => {
              if (!cell.day) return <div key={cell.key} className={styles.empty} />;
              const hasEvents = cell.events && cell.events.length > 0;
              const isToday = cell.date.getTime() === today.getTime();
              return (
                <button
                  key={cell.key}
                  type="button"
                  className={[
                    styles.day,
                    hasEvents ? styles.events : "",
                    isToday ? styles.today : "",
                  ].join(" ")}
                  onClick={() => {
                    if (hasEvents) setSelectedEventId(cell.events[0].id);
                  }}
                >
                  <span>{cell.day}</span>
                  {hasEvents && <span className={styles.dot} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      </div>

      <EventRegistrationModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}


