import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ImageUpload from "../../components/ImageUpload/ImageUpload";

const AdminEvents = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    time: "",
    price: "",
    eventType: "offline",
    location: "",
    image: "",
    telegramLink: "",
    isActive: true
  });
  const router = useRouter();

  useEffect(() => {
    // Check if logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
    } else {
      fetchEvents();
    }
  }, [router]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const result = await response.json();
      
      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error('Помилка завантаження подій:', error);
      setMessage({ type: 'error', text: 'Не вдалося завантажити події' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      let response;
      
      if (isEditing) {
        // Оновити існуючу подію
        response = await fetch(`/api/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Створити нову подію
        response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      const result = await response.json();

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: isEditing ? 'Подію успішно оновлено!' : 'Подію успішно створено!' 
        });
        
        // Оновити список подій
        await fetchEvents();
        resetForm();
        
        // Очистити повідомлення через 3 секунди
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Сталася помилка' });
      }
    } catch (error) {
      console.error('Помилка збереження:', error);
      setMessage({ type: 'error', text: 'Не вдалося зберегти подію' });
    } finally {
      setIsSaving(false);
    }
  };

  // Функція для конвертації дати з ISO формату в формат yyyy-MM-dd для input type="date"
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Перевіряємо чи дата валідна
      if (isNaN(date.getTime())) return "";
      // Повертаємо дату у форматі yyyy-MM-dd
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Помилка форматування дати:', error);
      return "";
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      startDate: formatDateForInput(event.startDate),
      endDate: formatDateForInput(event.endDate),
      time: event.time || "",
      price: event.price || "",
      eventType: event.eventType || "offline",
      location: event.location || "",
      image: event.image || "",
      telegramLink: event.telegramLink || "",
      isActive: event.isActive !== undefined ? event.isActive : true
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Ви впевнені, що хочете видалити цю подію?")) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Подію успішно видалено!' });
        await fetchEvents();
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: 'Не вдалося видалити подію' });
      }
    } catch (error) {
      console.error('Помилка видалення:', error);
      setMessage({ type: 'error', text: 'Не вдалося видалити подію' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      time: "",
      price: "",
      eventType: "offline",
      location: "",
      image: "",
      telegramLink: "",
      isActive: true
    });
    setIsEditing(false);
    setEditingEvent(null);
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('uk-UA', options);
    }
    
    return `${start.toLocaleDateString('uk-UA', { day: '2-digit', month: 'long' })} – ${end.toLocaleDateString('uk-UA', options)}`;
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
          {/* Message */}
          {message.text && (
            <div className={`admin-message admin-message--${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Add/Edit Event Form */}
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2 className="admin-form__title">
              {isEditing ? 'Редагувати подію' : 'Додати нову подію'}
            </h2>
            
            <div className="admin-form__grid">
              <div className="admin-form__field admin-form__field--full">
                <label className="admin-form__label">Назва події *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                  placeholder="Наприклад: Майстер-клас з озеленення дворів"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Дата початку *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Дата завершення *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Час проведення *</label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                  placeholder="Наприклад: 10:00 - 14:00"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Ціна *</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                  placeholder="Наприклад: Безкоштовно або 2500 грн"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Тип події *</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                >
                  <option value="offline">Офлайн</option>
                  <option value="online">Онлайн</option>
                </select>
              </div>

              {formData.eventType === 'offline' && (
                <div className="admin-form__field admin-form__field--full">
                  <label className="admin-form__label">Місце проведення *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="admin-form__input"
                    required={formData.eventType === 'offline'}
                    placeholder="Наприклад: Київ, вул. Хрещатик 22"
                  />
                </div>
              )}

              <div className="admin-form__field admin-form__field--full">
                <label className="admin-form__label">Опис події *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="admin-form__textarea"
                  required
                  placeholder="Короткий опис події..."
                />
              </div>

              <div className="admin-form__field admin-form__field--full">
                <label className="admin-form__label">Зображення події</label>
                <ImageUpload
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                />
                <small style={{ color: '#666', fontSize: '12px', marginTop: '8px', display: 'block' }}>
                  Завантажте зображення або перетягніть його в поле вище
                </small>
              </div>

              <div className="admin-form__field admin-form__field--full">
                <label className="admin-form__label">Посилання на телеграм чат</label>
                <input
                  type="url"
                  name="telegramLink"
                  value={formData.telegramLink}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  placeholder="https://t.me/your_chat"
                />
                <small style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                  Користувачі будуть перенаправлені сюди після оплати
                </small>
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    style={{ width: 'auto', cursor: 'pointer' }}
                  />
                  Активна подія (відображається в календарі)
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                type="submit" 
                className="admin-form__button"
                disabled={isSaving}
              >
                {isSaving ? 'Збереження...' : (isEditing ? 'Оновити подію' : 'Додати подію')}
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="admin-form__button" 
                  style={{ background: '#6c757d' }}
                >
                  Скасувати
                </button>
              )}
            </div>
          </form>

          {/* Events List */}
          <div className="admin-list">
            <h2 className="admin-list__title">
              Список подій ({events.length})
            </h2>
            
            {events.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                Подій ще немає. Додайте першу подію!
              </p>
            ) : (
              events.map(event => (
                <div key={event.id} className="admin-list__item">
                  {event.image && (
                    <div className="admin-list__item-image">
                      <img src={event.image} alt={event.title} />
                    </div>
                  )}
                  <div className="admin-list__item-info">
                    <h3 className="admin-list__item-title">
                      {event.title}
                      {!event.isActive && <span style={{ color: '#dc3545', fontSize: '12px', marginLeft: '8px' }}>(неактивна)</span>}
                    </h3>
                    <p className="admin-list__item-description">
                      📅 {formatDateRange(event.startDate, event.endDate)} • 
                      🕐 {event.time} • 
                      💰 {event.price.toLowerCase().includes('безкоштовно') ? event.price : `${event.price.replace(/грн/gi, '').trim()} ₴`} •
                      {event.eventType === 'online' ? 'Онлайн' : `${event.location}`}
                    </p>
                    <p className="admin-list__item-description" style={{ fontSize: '13px', marginTop: '4px' }}>
                      {event.description}
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
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminEvents;
