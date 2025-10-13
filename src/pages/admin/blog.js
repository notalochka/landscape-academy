import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import MarkdownEditor from "../../components/MarkdownEditor/MarkdownEditor";

const AdminBlog = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    title: "",
    tag: "",
    author: "",
    content: "",
    image: "",
    isPublished: true
  });
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
    } else {
      fetchPosts();
    }
  }, [router]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      const result = await response.json();
      
      if (result.success) {
        setPosts(result.data);
      }
    } catch (error) {
      console.error('Помилка завантаження блогів:', error);
      setMessage({ type: 'error', text: 'Не вдалося завантажити блоги' });
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
        response = await fetch(`/api/blog/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        response = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      const result = await response.json();

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: isEditing ? 'Блог успішно оновлено!' : 'Блог успішно створено!' 
        });
        
        await fetchPosts();
        resetForm();
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Сталася помилка' });
      }
    } catch (error) {
      console.error('Помилка збереження:', error);
      setMessage({ type: 'error', text: 'Не вдалося зберегти блог' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || "",
      tag: post.tag || "",
      author: post.author || "",
      content: post.content || "",
      image: post.image || "",
      isPublished: post.isPublished !== undefined ? post.isPublished : true
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (postId) => {
    if (!confirm("Ви впевнені, що хочете видалити цю статтю?")) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Статтю успішно видалено!' });
        await fetchPosts();
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: 'Не вдалося видалити статтю' });
      }
    } catch (error) {
      console.error('Помилка видалення:', error);
      setMessage({ type: 'error', text: 'Не вдалося видалити статтю' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      tag: "",
      author: "",
      content: "",
      image: "",
      isPublished: true
    });
    setIsEditing(false);
    setEditingPost(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
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
          {message.text && (
            <div className={`admin-message admin-message--${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Add/Edit Blog Form */}
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2 className="admin-form__title">
              {isEditing ? 'Редагувати статтю' : 'Додати нову статтю'}
            </h2>
            
            <div className="admin-form__grid">
              <div className="admin-form__field admin-form__field--full">
                <label className="admin-form__label">Назва статті *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                  placeholder="Наприклад: Як створити ландшафтний дизайн"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Тег (категорія) *</label>
                <input
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                  placeholder="Наприклад: дизайн, маркетинг, AI"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Автор *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                  placeholder="Ім'я автора"
                />
              </div>

              <div className="admin-form__field admin-form__field--full">
                <label className="admin-form__label">Зображення статті</label>
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
                <label className="admin-form__label">
                  Текст статті (Markdown) *
                </label>
                <MarkdownEditor
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    style={{ width: 'auto', cursor: 'pointer' }}
                  />
                  Опублікована стаття
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                type="submit" 
                className="admin-form__button"
                disabled={isSaving}
              >
                {isSaving ? 'Збереження...' : (isEditing ? 'Оновити статтю' : 'Додати статтю')}
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

          {/* Blog Posts List */}
          <div className="admin-list">
            <h2 className="admin-list__title">
              Список статей ({posts.length})
            </h2>
            
            {posts.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                Статей ще немає. Додайте першу статтю!
              </p>
            ) : (
              posts.map(post => (
                <div key={post.id} className="admin-list__item">
                  {post.image && (
                    <div className="admin-list__item-image">
                      <img src={post.image} alt={post.title} />
                    </div>
                  )}
                  <div className="admin-list__item-info">
                    <h3 className="admin-list__item-title">
                      {post.title}
                      {!post.isPublished && <span style={{ color: '#dc3545', fontSize: '12px', marginLeft: '8px' }}>(не опублікована)</span>}
                    </h3>
                    <p className="admin-list__item-description">
                      📅 {formatDate(post.createdAt)} • 
                      🏷️ {post.tag} • 
                      ✍️ {post.author} • 
                      ⏱️ {post.readTime}
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
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminBlog;
