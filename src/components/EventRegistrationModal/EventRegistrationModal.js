import React, { useState, useEffect } from 'react';
import styles from './EventRegistrationModal.module.css';

const EventRegistrationModal = ({ event, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const isFree = event.price?.toLowerCase().includes('безкоштовно');
  const hasTelegramLink = event.telegramLink && event.telegramLink.trim() !== '';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      if (isFree) {
        // Безкоштовна реєстрація
        const response = await fetch('/api/registration/free', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: event.id,
            eventTitle: event.title,
            userName: formData.name,
            userPhone: formData.phone,
            userEmail: formData.email,
            telegramLink: event.telegramLink
          })
        });

        const result = await response.json();

        if (result.success) {
          if (hasTelegramLink) {
            // Редірект на Telegram групу
            setMessage({ 
              type: 'success', 
              text: 'Реєстрація успішна! Перенаправляємо вас до Telegram групи...' 
            });
            setTimeout(() => {
              window.location.href = event.telegramLink;
            }, 2000);
          } else {
            // Просто повідомлення
            setMessage({ 
              type: 'success', 
              text: 'Реєстрацію прийнято! Наші менеджери зв\'яжуться з вами найближчим часом.' 
            });
            setTimeout(() => {
              onClose();
            }, 3000);
          }
        } else {
          setMessage({ type: 'error', text: 'Помилка реєстрації. Спробуйте ще раз.' });
        }
      } else {
        // Платна подія - створюємо платіж
        const response = await fetch('/api/payment/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: event.id,
            eventTitle: event.title,
            price: event.price,
            userName: formData.name,
            userPhone: formData.phone,
            userEmail: formData.email
          })
        });

        const result = await response.json();

        if (result.success) {
          // Відкриваємо форму WayForPay
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = 'https://secure.wayforpay.com/pay';
          form.target = '_self';

          Object.keys(result.data).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = Array.isArray(result.data[key]) 
              ? result.data[key].join(';') 
              : result.data[key];
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
        } else {
          setMessage({ type: 'error', text: 'Помилка створення платежу. Спробуйте ще раз.' });
        }
      }
    } catch (error) {
      console.error('Помилка:', error);
      setMessage({ type: 'error', text: 'Помилка з\'єднання. Спробуйте ще раз.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <h2 className={styles.title}>Реєстрація на подію</h2>
        <h3 className={styles.eventTitle}>{event.title}</h3>
        
        {!isFree && (
        <div className={styles.priceInfo}>
          <span className={styles.price}>
            {event.price.replace(/грн/gi, '').trim()} ₴
          </span>
          {hasTelegramLink && (
            <p className={styles.note}>
              Після успішної оплати ви отримаєте посилання на Telegram групу події
            </p>
          )}
        </div>
        )}

        {isFree && !hasTelegramLink && (
          <div className={styles.info}>
            Наші менеджери зв&apos;яжуться з вами по вказаному номеру телефону
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Ім&apos;я *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Введіть ваше ім'я"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Номер телефону *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="+380 XX XXX XX XX"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email (опціонально)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="your@email.com"
            />
          </div>

          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Обробка...' : (isFree ? 'Зареєструватися' : 'Перейти до оплати')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventRegistrationModal;

