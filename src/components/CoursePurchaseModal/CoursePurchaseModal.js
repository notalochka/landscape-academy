import React, { useState, useEffect } from 'react';
import styles from './CoursePurchaseModal.module.css';

const CoursePurchaseModal = ({ isOpen, onClose, courseData }) => {
  const [formData, setFormData] = useState({
    userName: '',
    userPhone: '',
    userEmail: '',
    telegramUsername: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Блокуємо скролінг сторінки коли модальне вікно відкрите
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Очищаємо стилі при розмонтуванні компонента
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.userName.trim()) {
      setError('Будь ласка, введіть ваше ім\'я');
      return false;
    }
    if (!formData.userPhone.trim()) {
      setError('Будь ласка, введіть номер телефону');
      return false;
    }
    if (!formData.telegramUsername.trim()) {
      setError('Будь ласка, введіть Telegram username');
      return false;
    }
    return true;
  };

  const formatUah = (value) => {
    const s = `${value ?? ''}`.trim();
    if (!s) return '';
    return /[а-яА-Яa-zA-Z]/.test(s) ? s : `${s} грн`;
  };

  const getNumericPrice = (value) => {
    const s = `${value ?? ''}`;
    const digits = s.replace(/[^\d.]/g, '');
    return digits || '0';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Створюємо платіж через Wayforpay
      const response = await fetch('/api/course/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: courseData.id,
          courseTitle: courseData.title,
          price: getNumericPrice(courseData.price),
          userName: formData.userName,
          userPhone: formData.userPhone,
          userEmail: formData.userEmail,
          telegramUsername: formData.telegramUsername
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Визначаємо, чи це мобільний пристрій
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Перенаправляємо на Wayforpay
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://secure.wayforpay.com/pay';
        // На мобільних використовуємо _self, щоб форма відкрилася в поточному вікні
        form.target = isMobile ? '_self' : '_blank';

        Object.keys(result.data).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = result.data[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        
        if (isMobile) {
          // На мобільних: відправляємо форму в поточному вікні
          // Модальне вікно закриється автоматично при перенаправленні на Wayforpay
          // Не закриваємо модальне вікно вручну, щоб уникнути конфліктів
          form.submit();
        } else {
          // На десктопі: відкриваємо в новій вкладці
          form.submit();
          setTimeout(() => {
            document.body.removeChild(form);
            onClose();
          }, 500);
        }
      } else {
        setError('Помилка при створенні платежу. Спробуйте пізніше.');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      setError('Помилка при створенні платежу. Спробуйте пізніше.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Придбати курс</h2>
          <p className={styles.courseTitle}>{courseData?.title}</p>
          <div className={styles.price}>
            <span className={styles.oldPrice}>{formatUah(courseData?.old_price)}</span>
            <span className={styles.newPrice}>{formatUah(courseData?.price)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="userName" className={styles.label}>
              Ім&apos;я та прізвище *
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Введіть ваше ім'я та прізвище"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="userPhone" className={styles.label}>
              Номер телефону *
            </label>
            <input
              type="tel"
              id="userPhone"
              name="userPhone"
              value={formData.userPhone}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="+380 (XX) XXX XX XX"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="userEmail" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="your.email@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="telegramUsername" className={styles.label}>
              Telegram username *
            </label>
            <input
              type="text"
              id="telegramUsername"
              name="telegramUsername"
              value={formData.telegramUsername}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="@username"
              required
            />
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Обробка...' : 'Перейти до оплати'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Після оплати ви отримаєте доступ до курсу та буде додано до Telegram групи
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoursePurchaseModal;
