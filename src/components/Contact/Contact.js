import React, { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    question: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post('/api/contact', formData);
      
      if (response.data.success) {
        setMessage({ 
          type: "success", 
          text: response.data.message 
        });
        // Очищаємо форму після успішної відправки
        setFormData({ name: "", phone: "", question: "" });
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Виникла помилка. Спробуйте пізніше." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="la-contact">
      <div className="la-contact__inner">
        <div className="la-contact__content">
          <div className="la-contact__text">
            <h2 className="la-contact__title">Привіт 👋</h2>
            <h2 className="la-contact__title">Бачу вас цікавить розвиток в ніші ландшафтного дизайну</h2>
            <p className="la-contact__description">
              Зв&apos;яжіться з нами, і ми з радістю дамо відповіді на всі Ваші питання!
            </p>
          </div>

          <form className="la-contact__form" onSubmit={handleSubmit}>
            {message.text && (
              <div className={`la-contact__message la-contact__message--${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="la-contact__field">
              <label className="la-contact__label">Ваше імя:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="la-contact__input"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="la-contact__field">
              <label className="la-contact__label">Ваш телефон:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="la-contact__input"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="la-contact__field">
              <label className="la-contact__label">Ваше запитання:</label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                className="la-contact__textarea"
                rows="4"
                required
                disabled={isSubmitting}
              />
            </div>

            <button 
              type="submit" 
              className="la-contact__button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "ВІДПРАВКА..." : "НАПИШІТЬ НАМ"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
