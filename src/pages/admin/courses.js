import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const AdminCourses = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    speaker: "",
    price: "",
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
      // Mock data for courses
      setCourses([
        {
          id: 1,
          title: "Landscaper 5.0",
          description: "Перетвори хобі у бізнес",
          speaker: "Олексій Петренко",
          price: "25000",
          isActive: true
        },
        {
          id: 2,
          title: "ШІ рендер на телефоні",
          description: "Від ескізу до WOW за 5 хвилин",
          speaker: "Марія Коваленко",
          price: "15000",
          isActive: true
        },
        {
          id: 3,
          title: "Метод роботи практикуючого ландшафтного дизайнера",
          description: "Або в чому секрет виходу на високий чек",
          speaker: "Дмитро Сидоренко",
          price: "35000",
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
      setCourses(courses.map(course => 
        course.id === editingCourse.id 
          ? { ...course, ...formData }
          : course
      ));
    } else {
      const newCourse = {
        id: Date.now(),
        ...formData
      };
      setCourses([...courses, newCourse]);
    }
    
    resetForm();
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData(course);
    setIsEditing(true);
  };

  const handleDelete = (courseId) => {
    if (confirm("Ви впевнені, що хочете видалити цей курс?")) {
      setCourses(courses.filter(course => course.id !== courseId));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      speaker: "",
      price: "",
      image: "",
      paymentLink: "",
      isActive: true
    });
    setIsEditing(false);
    setEditingCourse(null);
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
        <title>Управління курсами - Landscape Academy</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="admin-management">
        <header className="admin-management__header">
          <div className="admin-management__header-inner">
            <h1 className="admin-management__title">Управління курсами</h1>
            <Link href="/admin/dashboard" className="admin-management__back">
              ← Назад до дашборду
            </Link>
          </div>
        </header>

        <main className="admin-management__content">
          {/* Add/Edit Course Form */}
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2 className="admin-form__title">
              {isEditing ? 'Редагувати курс' : 'Додати новий курс'}
            </h2>
            
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

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="admin-form__button">
                {isEditing ? 'Оновити курс' : 'Додати курс'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="admin-form__button" style={{ background: '#6c757d' }}>
                  Скасувати
                </button>
              )}
            </div>
          </form>

          {/* Courses List */}
          <div className="admin-list">
            <h2 className="admin-list__title">Список курсів</h2>
            
            {courses.map(course => (
              <div key={course.id} className="admin-list__item">
                <div className="admin-list__item-info">
                  <h3 className="admin-list__item-title">{course.title}</h3>
                  <p className="admin-list__item-description">
                    {course.description} • Спікер: {course.speaker} • Ціна: {course.price ? `${course.price} грн` : 'Безкоштовно'}
                  </p>
                </div>
                <div className="admin-list__item-actions">
                  <button 
                    className="admin-list__button"
                    onClick={() => handleEdit(course)}
                  >
                    Редагувати
                  </button>
                  <button 
                    className="admin-list__button admin-list__button--danger"
                    onClick={() => handleDelete(course.id)}
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

export default AdminCourses;
