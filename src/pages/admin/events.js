import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const AdminEvents = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    locationType: "online", // online or offline
    speaker: "",
    description: "",
    image: "",
    paymentLink: "",
    isActive: true
  });
  const router = useRouter();

  useEffect(() => {
    // Check if logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
    } else {
      setIsLoading(false);
      // Mock data for events
      setEvents([
        {
          id: 1,
          title: "Майстер-клас з ландшафтного дизайну",
          date: "2024-02-15",
          time: "18:00",
          location: "Київ, вул. Хрещатик 1",
          locationType: "offline",
          speaker: "Олексій Петренко",
          description: "Практичний майстер-клас з основ ландшафтного дизайну",
          isActive: true
        },
        {
          id: 2,
          title: "Онлайн семінар: Тренди 2024",
          date: "2024-02-20",
          time: "19:00",
          location: "Zoom",
          locationType: "online",
          speaker: "Марія Коваленко",
          description: "Обговорення нових трендів у ландшафтному дизайні",
          isActive: true
        }
      ]);
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally save to database
    if (isEditing) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...formData }
          : event
      ));
    } else {
      const newEvent = {
        id: Date.now(),
        ...formData
      };
      setEvents([...events, newEvent]);
    }
    
    resetForm();
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setIsEditing(true);
  };

  const handleDelete = (eventId) => {
    if (confirm("Ви впевнені, що хочете видалити цю подію?")) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      locationType: "online",
      speaker: "",
      description: "",
      image: "",
      paymentLink: "",
      isActive: true
    });
    setIsEditing(false);
    setEditingEvent(null);
  };

  if (isLoading) {
    return (
      <div className="admin-login">
        <div className="admin-login__container">
          <p>Завантаження...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Управління подіями - Landscape Academy</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="admin-management">
        <header className="admin-management__header">
          <div className="admin-management__header-inner">
            <h1 className="admin-management__title">Управління подіями</h1>
            <Link href="/admin/dashboard" className="admin-management__back">
              ← Назад до дашборду
            </Link>
          </div>
        </header>

        <main className="admin-management__content">
          {/* Add/Edit Event Form */}
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2 className="admin-form__title">
              {isEditing ? 'Редагувати подію' : 'Додати нову подію'}
            </h2>
            
            <div className="admin-form__grid">
              <div className="admin-form__field">
                <label className="admin-form__label">Назва події</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                  placeholder="Введіть назву події"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Спікер</label>
                <input
                  type="text"
                  name="speaker"
                  value={formData.speaker}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                  placeholder="Введіть ім'я спікера"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Дата</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Час</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Тип події</label>
                <select
                  name="locationType"
                  value={formData.locationType}
                  onChange={handleInputChange}
                  className="admin-form__input"
                >
                  <option value="online">Онлайн</option>
                  <option value="offline">Офлайн</option>
                </select>
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Місце проведення</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                  placeholder={formData.locationType === 'online' ? 'Zoom, Google Meet тощо' : 'Адреса проведення'}
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Посилання на зображення</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Посилання після оплати</label>
                <input
                  type="url"
                  name="paymentLink"
                  value={formData.paymentLink}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  placeholder="https://example.com/success"
                />
              </div>

              <div className="admin-form__field admin-form__field--full">
                <label className="admin-form__label">Опис події</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="admin-form__textarea"
                  required
                  placeholder="Введіть опис події"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Активна подія
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="admin-form__button">
                {isEditing ? 'Оновити подію' : 'Додати подію'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="admin-form__button" style={{ background: '#6c757d' }}>
                  Скасувати
                </button>
              )}
            </div>
          </form>

          {/* Events List */}
          <div className="admin-list">
            <h2 className="admin-list__title">Список подій</h2>
            
            {events.map(event => (
              <div key={event.id} className="admin-list__item">
                <div className="admin-list__item-info">
                  <h3 className="admin-list__item-title">{event.title}</h3>
                  <p className="admin-list__item-description">
                    {event.date} о {event.time} • {event.locationType === 'online' ? 'Онлайн' : 'Офлайн'} • {event.location} • Спікер: {event.speaker}
                  </p>
                </div>
                <div className="admin-list__item-actions">
                  <button 
                    className="admin-list__button"
                    onClick={() => handleEdit(event)}
                  >
                    Редагувати
                  </button>
                  <button 
                    className="admin-list__button admin-list__button--danger"
                    onClick={() => handleDelete(event.id)}
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminEvents;
