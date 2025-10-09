import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    question: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <section className="la-contact">
      <div className="la-contact__inner">
        <div className="la-contact__content">
          <div className="la-contact__text">
            <h2 className="la-contact__title">Привіт 👋</h2>
            <h2 className="la-contact__title">Бачу вас цікавить розвиток в ніші ландшафтного дизайну</h2>
            <p className="la-contact__description">
              Зв'яжіться з нами, і ми з радістю дамо відповіді на всі Ваші питання!
            </p>
          </div>

          <form className="la-contact__form" onSubmit={handleSubmit}>
            <div className="la-contact__field">
              <label className="la-contact__label">Ваше імя:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="la-contact__input"
                required
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
              />
            </div>

            <button type="submit" className="la-contact__button">
              НАПИШІТЬ НАМ
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;




















