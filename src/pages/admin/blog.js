import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const AdminBlog = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    readTime: "",
    author: "",
    description: "",
    content: "",
    image: "",
    tags: [],
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    isPublished: true
  });
  const [newTag, setNewTag] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
    } else {
      setIsLoading(false);
      // Mock data for blog posts
      setPosts([
        {
          id: 1,
          title: "Як створити успішний ландшафтний дизайн-проект",
          category: "дизайн",
          date: "2024-12-15",
          readTime: "20 хвилин читання",
          author: "Олексій Петренко",
          description: "Повний гід по створенню професійного ландшафтного дизайну від концепції до реалізації",
          content: "Повний контент статті...",
          tags: ["ландшафт", "дизайн", "проектування"],
          seoTitle: "Ландшафтний дизайн: як створити успішний проект",
          seoDescription: "Дізнайтеся як створити професійний ландшафтний дизайн проект з нуля",
          seoKeywords: "ландшафтний дизайн, проектування, сад",
          isPublished: true
        },
        {
          id: 2,
          title: "Маркетинг для ландшафтних дизайнерів: як знайти клієнтів",
          category: "маркетинг",
          date: "2024-12-12",
          readTime: "15 хвилин читання",
          author: "Марія Коваленко",
          description: "Ефективні стратегії маркетингу для розвитку бізнесу в сфері ландшафтного дизайну",
          content: "Повний контент статті...",
          tags: ["маркетинг", "бізнес", "клієнти"],
          seoTitle: "Маркетинг для ландшафтних дизайнерів",
          seoDescription: "Як знайти клієнтів для ландшафтного дизайну: поради та стратегії",
          seoKeywords: "маркетинг, ландшафтний дизайн, клієнти",
          isPublished: true
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
      setPosts(posts.map(post => 
        post.id === editingPost.id 
          ? { ...post, ...formData }
          : post
      ));
    } else {
      const newPost = {
        id: Date.now(),
        ...formData
      };
      setPosts([...posts, newPost]);
    }
    
    resetForm();
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData(post);
    setIsEditing(true);
  };

  const handleDelete = (postId) => {
    if (confirm("Ви впевнені, що хочете видалити цю статтю?")) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      date: "",
      readTime: "",
      author: "",
      description: "",
      content: "",
      image: "",
      tags: [],
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      isPublished: true
    });
    setIsEditing(false);
    setEditingPost(null);
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
        <title>Управління блогом - Landscape Academy</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="admin-management">
        <header className="admin-management__header">
          <div className="admin-management__header-inner">
            <h1 className="admin-management__title">Управління блогом</h1>
            <Link href="/admin/dashboard" className="admin-management__back">
              ← Назад до дашборду
            </Link>
          </div>
        </header>

        <main className="admin-management__content">
          {/* Add/Edit Post Form */}
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2 className="admin-form__title">
              {isEditing ? 'Редагувати статтю' : 'Додати нову статтю'}
            </h2>
            
            <div className="admin-form__grid">
              <div className="admin-form__field">
                <label className="admin-form__label">Назва статті</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                  placeholder="Введіть назву статті"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Категорія</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                >
                  <option value="">Оберіть категорію</option>
                  <option value="дизайн">Дизайн</option>
                  <option value="маркетинг">Маркетинг</option>
                  <option value="ai рендер">AI рендер</option>
                  <option value="бізнес">Бізнес</option>
                  <option value="технології">Технології</option>
                </select>
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Дата публікації</label>
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
                <label className="admin-form__label">Час читання</label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  placeholder="Наприклад: 20 хвилин читання"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Автор</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                  placeholder="Введіть ім'я автора"
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
                <label className="admin-form__label">Короткий опис</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="admin-form__textarea"
                  required
                  placeholder="Введіть короткий опис статті"
                  rows="3"
                />
              </div>

              <div className="admin-form__field admin-form__field--full">
                <label className="admin-form__label">Повний контент</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="admin-form__textarea"
                  required
                  placeholder="Введіть повний текст статті"
                  rows="10"
                />
              </div>

              <div className="admin-form__field admin-form__field--full">
                <label className="admin-form__label">Теги</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="admin-form__input"
                    placeholder="Додати новий тег"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="admin-form__button"
                    style={{ padding: '12px 16px', fontSize: '14px' }}
                  >
                    Додати
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        background: '#667eea',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO Section */}
              <div className="admin-form__field admin-form__field--full">
                <h3 style={{ 
                  fontFamily: 'Bender, sans-serif',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#303030',
                  margin: '0 0 16px 0',
                  textTransform: 'uppercase'
                }}>
                  SEO налаштування
                </h3>
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">SEO заголовок</label>
                <input
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  placeholder="SEO заголовок для пошукових систем"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">SEO ключові слова</label>
                <input
                  type="text"
                  name="seoKeywords"
                  value={formData.seoKeywords}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  placeholder="Ключові слова через кому"
                />
              </div>

              <div className="admin-form__field admin-form__field--full">
                <label className="admin-form__label">SEO опис</label>
                <textarea
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleInputChange}
                  className="admin-form__textarea"
                  placeholder="SEO опис для пошукових систем"
                  rows="3"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                  />
                  Опублікована
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="admin-form__button">
                {isEditing ? 'Оновити статтю' : 'Додати статтю'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="admin-form__button" style={{ background: '#6c757d' }}>
                  Скасувати
                </button>
              )}
            </div>
          </form>

          {/* Posts List */}
          <div className="admin-list">
            <h2 className="admin-list__title">Список статей</h2>
            
            {posts.map(post => (
              <div key={post.id} className="admin-list__item">
                <div className="admin-list__item-info">
                  <h3 className="admin-list__item-title">{post.title}</h3>
                  <p className="admin-list__item-description">
                    [{post.category}] • {post.date} • {post.readTime} • Автор: {post.author}
                    {post.tags.length > 0 && (
                      <span> • Теги: {post.tags.join(', ')}</span>
                    )}
                  </p>
                </div>
                <div className="admin-list__item-actions">
                  <button 
                    className="admin-list__button"
                    onClick={() => handleEdit(post)}
                  >
                    Редагувати
                  </button>
                  <button 
                    className="admin-list__button admin-list__button--danger"
                    onClick={() => handleDelete(post.id)}
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

export default AdminBlog;
