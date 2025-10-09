import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const AdminFlagship = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "Флагманський курс ландшафтного дизайну",
    description: "Наш флагманський курс - це комплексна програма навчання, яка дасть вам всі необхідні знання та навички для успішної роботи в сфері ландшафтного дизайну.",
    image: "",
    features: [
      "Професійні знання від досвідчених викладачів",
      "Практичні навички та реальні проекти",
      "Сертифікація після закінчення курсу"
    ],
    price: "45000",
    duration: "3 місяці",
    isActive: true
  });
  const [newFeature, setNewFeature] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
    } else {
      setIsLoading(false);
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
    alert("Інформація про флагманський курс оновлена!");
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
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
        <title>Флагманський курс - Landscape Academy</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="admin-management">
        <header className="admin-management__header">
          <div className="admin-management__header-inner">
            <h1 className="admin-management__title">Управління флагманським курсом</h1>
            <Link href="/admin/dashboard" className="admin-management__back">
              ← Назад до дашборду
            </Link>
          </div>
        </header>

        <main className="admin-management__content">
          {/* Edit Flagship Course Form */}
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2 className="admin-form__title">Редагувати флагманський курс</h2>
            
            <div className="admin-form__grid">
              <div className="admin-form__field">
                <label className="admin-form__label">Назва курсу</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                  placeholder="Введіть назву курсу"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Ціна (грн)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  placeholder="Введіть ціну"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Тривалість</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  placeholder="Наприклад: 3 місяці"
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

              <div className="admin-form__field admin-form__field--full">
                <label className="admin-form__label">Опис курсу</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="admin-form__textarea"
                  required
                  placeholder="Введіть опис курсу"
                />
              </div>

              <div className="admin-form__field admin-form__field--full">
                <label className="admin-form__label">Особливості курсу</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="admin-form__input"
                    placeholder="Додати нову особливість"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="admin-form__button"
                    style={{ padding: '12px 16px', fontSize: '14px' }}
                  >
                    Додати
                  </button>
                </div>
                <div>
                  {formData.features.map((feature, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: '#f8f9fa',
                      borderRadius: '4px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontFamily: 'Bender, sans-serif', fontSize: '14px' }}>
                        {feature}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        style={{
                          background: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Видалити
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Активний курс
                </label>
              </div>
            </div>

            <button type="submit" className="admin-form__button">
              Оновити інформацію
            </button>
          </form>

          {/* Preview Section */}
          <div className="admin-list">
            <h2 className="admin-list__title">Попередній перегляд</h2>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '24px', 
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ 
                fontFamily: 'Bender, sans-serif',
                fontSize: '24px',
                fontWeight: '600',
                color: '#303030',
                margin: '0 0 16px 0',
                textTransform: 'uppercase'
              }}>
                {formData.title}
              </h3>
              
              <p style={{ 
                fontFamily: 'Bender, sans-serif',
                fontSize: '16px',
                color: '#666',
                margin: '0 0 20px 0',
                lineHeight: '1.6'
              }}>
                {formData.description}
              </p>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ 
                  fontFamily: 'Bender, sans-serif',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#303030',
                  margin: '0 0 12px 0',
                  textTransform: 'uppercase'
                }}>
                  Особливості:
                </h4>
                <ul style={{ 
                  fontFamily: 'Bender, sans-serif',
                  fontSize: '14px',
                  color: '#666',
                  margin: 0,
                  paddingLeft: '20px'
                }}>
                  {formData.features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '20px',
                fontFamily: 'Bender, sans-serif',
                fontSize: '14px',
                color: '#666'
              }}>
                {formData.price && (
                  <span><strong>Ціна:</strong> {formData.price} грн</span>
                )}
                {formData.duration && (
                  <span><strong>Тривалість:</strong> {formData.duration}</span>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminFlagship;
