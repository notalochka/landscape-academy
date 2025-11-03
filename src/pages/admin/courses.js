import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import CourseProgramEditor from "../../components/CourseProgramEditor/CourseProgramEditor";

const AdminCourses = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description1: "",
    description2: "",
    price: "",
    oldPrice: "",
    startDate: "",
    experience: "",
    groupInfo: "",
    duration: "",
    problemTitle: "",
    problemIntro1: "",
    problemIntro2: "",
    resultTitle: "",
    resultList: "",
    resultConclusion: "",
    solutionTitle: "",
    solutionIntro: "",
    solutionHowTitle: "",
    solutionList: "",
    solutionConclusion: "",
    modules: "",
    themes: "",
    curators: "",
    authorName: "",
    authorBio1: "",
    authorBio2: "",
    authorPhoto: "",
    skills: "",
    courseType: "regular",
    telegramLink: "",
    isActive: true
  });
  const [targetAudience, setTargetAudience] = useState([]);
  const [showProgramEditor, setShowProgramEditor] = useState(false);
  const [programCourseId, setProgramCourseId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin");
    } else {
      fetchCourses();
    }
  }, [router]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses?all=1');
      const result = await response.json();
      
      if (result.success) {
        setCourses(result.data);
      }
    } catch (error) {
      console.error('Помилка завантаження курсів:', error);
      setMessage({ type: 'error', text: 'Не вдалося завантажити курси' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    try {
      // Завантажуємо дані курсу
      const courseResponse = await fetch(`/api/courses/${courseId}`);
      const courseResult = await courseResponse.json();
      
      if (courseResult.success) {
        setFormData({
          title: courseResult.data.title || "",
          subtitle: courseResult.data.subtitle || "",
          description1: courseResult.data.description_1 || "",
          description2: courseResult.data.description_2 || "",
          price: courseResult.data.price || "",
          oldPrice: courseResult.data.old_price || "",
          startDate: courseResult.data.start_date || "",
          experience: courseResult.data.experience || "",
          groupInfo: courseResult.data.group_info || "",
          duration: courseResult.data.duration || "",
          problemTitle: courseResult.data.problem_title || "",
          problemIntro1: courseResult.data.problem_intro1 || "",
          problemIntro2: courseResult.data.problem_intro2 || "",
          resultTitle: courseResult.data.result_title || "",
          resultList: courseResult.data.result_list || "",
          resultConclusion: courseResult.data.result_conclusion || "",
          solutionTitle: courseResult.data.solution_title || "",
          solutionIntro: courseResult.data.solution_intro || "",
          solutionHowTitle: courseResult.data.solution_how_title || "",
          solutionList: courseResult.data.solution_list || "",
          solutionConclusion: courseResult.data.solution_conclusion || "",
          modules: courseResult.data.modules || "",
          themes: courseResult.data.themes || "",
          curators: courseResult.data.curators || "",
          authorName: courseResult.data.author_name || "",
          authorBio1: courseResult.data.author_bio_1 || "",
          authorBio2: courseResult.data.author_bio_2 || "",
          authorPhoto: courseResult.data.author_photo || "",
          skills: courseResult.data.skills || "",
          courseType: courseResult.data.course_type || "regular",
          telegramLink: courseResult.data.telegram_link || "",
          isActive: !!courseResult.data.is_active
        });
      }

      // Завантажуємо цільову аудиторію
      const audienceResponse = await fetch(`/api/courses/${courseId}/target-audience`);
      const audienceResult = await audienceResponse.json();
      
      if (audienceResult.success) {
        if (audienceResult.data.length > 0) {
          setTargetAudience(audienceResult.data.map(item => ({ id: item.id, text: item.text })));
        } else {
          setTargetAudience([{ id: 1, text: '' }]);
        }
      }
    } catch (error) {
      console.error('Помилка завантаження даних курсу:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAudienceInputChange = (index, value) => {
    const newItems = [...targetAudience];
    newItems[index].text = value;
    setTargetAudience(newItems);
  };

  const addAudienceItem = () => {
    setTargetAudience([...targetAudience, { id: Date.now(), text: '' }]);
  };

  const removeAudienceItem = (index) => {
    if (targetAudience.length > 1) {
      const newItems = targetAudience.filter((_, i) => i !== index);
      setTargetAudience(newItems);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      let response;
      
      if (isEditing) {
        // Оновити існуючий курс
        response = await fetch(`/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Створити новий курс
        response = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      const result = await response.json();

      if (result.success) {
        // Зберігаємо цільову аудиторію
        const courseId = isEditing ? editingCourse.id : result.data.id;
        const audienceResponse = await fetch(`/api/courses/${courseId}/target-audience`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: targetAudience }),
        });

        const audienceResult = await audienceResponse.json();

        if (audienceResult.success) {
          setMessage({ 
            type: 'success', 
            text: isEditing ? 'Курс успішно оновлено!' : 'Курс успішно створено!' 
          });
          
          // Оновити список курсів
          await fetchCourses();
          resetForm();
          
          // Очистити повідомлення через 3 секунди
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } else {
          setMessage({ type: 'error', text: audienceResult.message || 'Не вдалося зберегти цільову аудиторію' });
        }
      } else {
        setMessage({ type: 'error', text: result.message || 'Сталася помилка' });
      }
    } catch (error) {
      console.error('Помилка збереження:', error);
      setMessage({ type: 'error', text: 'Не вдалося зберегти курс' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async (course) => {
    setEditingCourse(course);
    await fetchCourseDetails(course.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditProgram = (courseId) => {
    setProgramCourseId(courseId);
    setShowProgramEditor(true);
  };

  const handleDelete = async (courseId) => {
    if (!confirm("Ви впевнені, що хочете видалити цей курс?")) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Курс успішно видалено!' });
        await fetchCourses();
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: 'Не вдалося видалити курс' });
      }
    } catch (error) {
      console.error('Помилка видалення:', error);
      setMessage({ type: 'error', text: 'Не вдалося видалити курс' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description1: "",
      description2: "",
      price: "",
      oldPrice: "",
      startDate: "",
      experience: "",
      groupInfo: "",
      duration: "",
      problemTitle: "",
      problemIntro1: "",
      problemIntro2: "",
      resultTitle: "",
      resultList: "",
      resultConclusion: "",
      solutionTitle: "",
      solutionIntro: "",
      solutionHowTitle: "",
      solutionList: "",
      solutionConclusion: "",
      modules: "",
      themes: "",
      curators: "",
      authorName: "",
      authorBio1: "",
      authorBio2: "",
      authorPhoto: "",
      skills: "",
    courseType: "regular",
    telegramLink: "",
      isActive: true
    });
    setTargetAudience([{ id: 1, text: '' }]);
    setIsEditing(false);
    setEditingCourse(null);
  };

  const getCourseTypeLabel = (type) => {
    if (type === 'flagship') return '⭐ Флагманський';
    if (type === 'course-1') return '📱 Курс 1 (ШІ Рендер)';
    if (type === 'course-2') return '📚 Курс 2 (Метод роботи)';
    return '📖 Регулярний';
  };

  // Визначаємо тип курсу для умовного відображення
  const isFlagship = editingCourse?.course_type === 'flagship' || (!isEditing && formData.courseType === 'flagship');
  const isSimpleCourse = (
    editingCourse?.course_type === 'course-1' || 
    editingCourse?.course_type === 'course-2' || 
    editingCourse?.course_type === 'regular' ||
    (!isEditing && (formData.courseType === 'course-1' || formData.courseType === 'course-2' || formData.courseType === 'regular'))
  );
  const isCourse1 = editingCourse?.course_type === 'course-1' || (!isEditing && formData.courseType === 'course-1');

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
          {/* Message */}
          {message.text && (
            <div className={`admin-message admin-message--${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Add/Edit Course Form */}
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2 className="admin-form__title">
              {isEditing ? 'Редагувати курс' : 'Додати новий курс'}
            </h2>
            
            <div className="admin-form__grid">
              <div className="admin-form__field">
                <label className="admin-form__label">Назва курсу *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                  placeholder="LANDSCAPER 5.0"
                />
              </div>

              {/* Підзаголовок */}
              <div className="admin-form__field">
                  <label className="admin-form__label">Підзаголовок</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="admin-form__input"
                    placeholder="ПЕРЕТВОРИ ХОБІ У БІЗНЕС"
                  />
                </div>

                
              
                {isFlagship && (

                  <>
                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Опис 1 *</label>
                    <textarea
                      name="description1"
                      value={formData.description1}
                      onChange={handleInputChange}
                      className="admin-form__textarea"
                      required
                      placeholder="ЗА 6 ТИЖНІВ РАЗОМ ПРОЙДЕМО ШЛЯХ ВІД ЧІТКОГО ПЛАНУВАННЯ ДО ЗАЛУЧЕННЯ КЛІЄНТІВ ТА МАСШТАБУВАННЯ ДОХОДІВ"
                      rows="3"
                    />
                  </div>

                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Опис 2</label>
                    <textarea
                      name="description2"
                      value={formData.description2}
                      onChange={handleInputChange}
                      className="admin-form__textarea"
                      placeholder="ОСВІТНІЙ КУРС ДЛЯ ЛАНДШАФТНИКІВ, ДИЗАЙНЕРІВ, САДІВНИКІВ, ТОПІАРНИКІВ ТА ВЛАСНИКІВ САДОВИХ ЦЕНТРІВ"
                      rows="2"
                    />
                  </div>
                </>
                )}

              {/* Ціна, стара ціна та дата */}
              <div className="admin-form__field">
                <label className="admin-form__label">Ціна *</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  required
                  placeholder="13900"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Стара ціна</label>
                <input
                  type="text"
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  placeholder="15000"
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Дата початку</label>
                <input
                  type="text"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="admin-form__input"
                  placeholder="20.01.2025"
                />
              </div>
      <div className="admin-form__field admin-form__field--full">
        <label className="admin-form__label">Telegram посилання (для доступу після оплати)</label>
        <input
          type="text"
          name="telegramLink"
          value={formData.telegramLink}
          onChange={handleInputChange}
          className="admin-form__input"
          placeholder="https://t.me/+xxxxxxx"
        />
      </div>
              <div className="admin-form__field">
                    <label className="admin-form__label">Досвід</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="admin-form__input"
                      placeholder="3 роки"
                    />
                  </div>

                  <div className="admin-form__field">
                    <label className="admin-form__label">Група</label>
                    <input
                      type="text"
                      name="groupInfo"
                      value={formData.groupInfo}
                      onChange={handleInputChange}
                      className="admin-form__input"
                      placeholder="3 групи"
                    />
                  </div>
              {/* Поля для простих курсів */}
              {isSimpleCourse && (
                <>
                  <div className="admin-form__field">
                    <label className="admin-form__label">Тривалість</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="admin-form__input"
                      placeholder="6 тижнів"
                    />
                  </div>

                  {/* Problem/Result texts for simple courses */}
                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Заголовок проблеми</label>
                    <input
                      type="text"
                      name="problemTitle"
                      value={formData.problemTitle}
                      onChange={handleInputChange}
                      className="admin-form__input"
                      placeholder={'КОЛИ КЛІЄНТ КАЖЕ "НЕ РОЗУМІЮ, ЯК ЦЕ ВИГЛЯДАТИМЕ"'}
                    />
                  </div>

                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Проблема — абзац 1</label>
                    <textarea
                      name="problemIntro1"
                      value={formData.problemIntro1}
                      onChange={handleInputChange}
                      className="admin-form__textarea"
                      rows="3"
                      placeholder="Знайома ситуація?..."
                    />
                  </div>

                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Проблема — абзац 2</label>
                    <textarea
                      name="problemIntro2"
                      value={formData.problemIntro2}
                      onChange={handleInputChange}
                      className="admin-form__textarea"
                      rows="3"
                      placeholder="Клієнти приймають рішення серцем..."
                    />
                  </div>

                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Заголовок результату</label>
                    <input
                      type="text"
                      name="resultTitle"
                      value={formData.resultTitle}
                      onChange={handleInputChange}
                      className="admin-form__input"
                      placeholder="Раніше якісна візуалізація означала:"
                    />
                  </div>

                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Список результату (кожен пункт з нового рядка)</label>
                    <textarea
                      name="resultList"
                      value={formData.resultList}
                      onChange={handleInputChange}
                      className="admin-form__textarea"
                      rows="4"
                      placeholder={"Години роботи в 3ds Max або SketchUp\nПотужний комп'ютер, який гуде як літак\nКупу плагінів та налаштувань\nІ все одно результат не завжди вражає"}
                    />
                  </div>

                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Підсумок результату</label>
                    <textarea
                      name="resultConclusion"
                      value={formData.resultConclusion}
                      onChange={handleInputChange}
                      className="admin-form__textarea"
                      rows="3"
                      placeholder="Результат? Більшість дизайнерів..."
                    />
                  </div>
                </>
              )}
              

              {isCourse1 && (
                <>
                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Заголовок рішення</label>
                    <input
                      type="text"
                      name="solutionTitle"
                      value={formData.solutionTitle}
                      onChange={handleInputChange}
                      className="admin-form__input"
                      placeholder="РІШЕННЯ ЗА НЕЙРОМЕРЕЖАМИ ТА ШТУЧНИМ ІНТЕЛЕКТОМ."
                    />
                  </div>

                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Опис рішення</label>
                    <textarea
                      name="solutionIntro"
                      value={formData.solutionIntro}
                      onChange={handleInputChange}
                      className="admin-form__textarea"
                      rows="3"
                      placeholder="МИ СТВОРИЛИ LANDSCAPER RENDER ASSISTANT ..."
                    />
                  </div>

                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Підзаголовок &quot;Як це працює&quot;</label>
                    <input
                      type="text"
                      name="solutionHowTitle"
                      value={formData.solutionHowTitle}
                      onChange={handleInputChange}
                      className="admin-form__input"
                      placeholder="ЯК ЦЕ ПРАЦЮЄ"
                    />
                  </div>

                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Кроки (кожен пункт з нового рядка)</label>
                    <textarea
                      name="solutionList"
                      value={formData.solutionList}
                      onChange={handleInputChange}
                      className="admin-form__textarea"
                      rows="4"
                      placeholder={"РОБИТЕ ФОТО ЕСКІЗУ НА ТЕЛЕФОН (АБО ЗАВАНТАЖУЄТЕ ФАЙЛ)\nВІДПРАВЛЯЄТЕ В НАШ ШІ-АСИСТЕНТ\nЧЕРЕЗ 3-5 ХВИЛИН ОТРИМУЄТЕ РЕНДЕР, ЯКИЙ ХОЧЕТЬСЯ ПОКАЗАТИ ВСІМ"}
                    />
                  </div>

                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Фінальний меседж</label>
                    <textarea
                      name="solutionConclusion"
                      value={formData.solutionConclusion}
                      onChange={handleInputChange}
                      className="admin-form__textarea"
                      rows="2"
                      placeholder="БЕЗ СКЛАДНИХ ПРОГРАМ. БЕЗ ПОТУЖНОГО КОМП'ЮТЕРА. ПРЯМО НА ТЕЛЕФОНІ."
                    />
                  </div>
                </>
              )}

              {isSimpleCourse && (
                <>
                  {/* Автор (мінімально) */}
                  <div className="admin-form__field">
                    <label className="admin-form__label">Ім&#39;я автора</label>
                    <input
                      type="text"
                      name="authorName"
                      value={formData.authorName}
                      onChange={handleInputChange}
                      className="admin-form__input"
                      placeholder="КОМАР КАТЕРИНА"
                    />
                  </div>

                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Опис автора (кожен пункт з нового рядка)</label>
                    <textarea
                      name="authorBio1"
                      value={formData.authorBio1}
                      onChange={handleInputChange}
                      className="admin-form__textarea"
                      rows="4"
                      placeholder={"Магістр садово-паркового дизайну\nСпівзасновниця LANDSCAPER Academy\n8+ років досвіду в маркетингу для особистих брендів\n2+ роки впроваджує ШІ-технології в роботу команди\nмаю сертифікат від Google по Основам ШІ"}
                    />
                  </div>

                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Фото автора</label>
                    <ImageUpload
                      name="authorPhoto"
                      value={formData.authorPhoto}
                      onChange={handleInputChange}
                    />
                    <small style={{ color: '#666', fontSize: '12px', marginTop: '8px', display: 'block' }}>
                      Завантажте фото автора або перетягніть його в поле вище
                    </small>
                  </div>

                  {/* Target Audience Section (для простих курсів) */}
                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">
                      Цільова аудиторія (можете додавати/видаляти пункти)
                    </label>

                    {targetAudience.map((item, index) => (
                      <div key={item.id} className="admin-form__list-item">
                        <div className="admin-form__list-item-number">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <textarea
                          value={item.text}
                          onChange={(e) => handleAudienceInputChange(index, e.target.value)}
                          className="admin-form__textarea admin-form__textarea--list"
                          rows="2"
                          placeholder="Введіть текст пункту списку"
                          required
                        />
                        {targetAudience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAudienceItem(index)}
                            className="admin-form__remove-button"
                            title="Видалити пункт"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addAudienceItem}
                      className="admin-form__add-button"
                    >
                      + Додати пункт
                    </button>
                  </div>
                </>
              )}

              {isCourse1 && (
                <>
                {/* Skills for Course 1 */}
                <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Особливо корисно, якщо ви (список, кожен пункт з нового рядка)</label>
                    {formData.skills ? formData.skills.split('\n').map((skill, index) => (
                      <div key={index} className="admin-form__list-item">
                        <div className="admin-form__list-item-number">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <textarea
                          value={skill}
                          onChange={(e) => {
                            const newSkills = formData.skills.split('\n');
                            newSkills[index] = e.target.value;
                            setFormData({ ...formData, skills: newSkills.join('\n') });
                          }}
                          className="admin-form__textarea admin-form__textarea--list"
                          rows="2"
                          placeholder="Введіть пункт"
                          required
                        />
                        {formData.skills.split('\n').length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newSkills = formData.skills.split('\n');
                              newSkills.splice(index, 1);
                              setFormData({ ...formData, skills: newSkills.join('\n') });
                            }}
                            className="admin-form__remove-button"
                            title="Видалити пункт"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )) : (
                      <div className="admin-form__list-item">
                        <div className="admin-form__list-item-number">01</div>
                        <textarea
                          value=""
                          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                          className="admin-form__textarea admin-form__textarea--list"
                          rows="2"
                          placeholder="Введіть пункт"
                          required
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const currentSkills = formData.skills || '';
                        setFormData({ ...formData, skills: currentSkills + (currentSkills ? '\n' : '') + '' });
                      }}
                      className="admin-form__add-button"
                    >
                      + Додати пункт
                    </button>
                  </div>
                </>
              )}

              {/* Поля тільки для флагманського курсу */}
              {isFlagship && (
                <>
                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Telegram посилання (для доступу після оплати)</label>
                    <input
                      type="text"
                      name="telegramLink"
                      value={formData.telegramLink}
                      onChange={handleInputChange}
                      className="admin-form__input"
                      placeholder="https://t.me/+xxxxxxx"
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
                      placeholder="6 тижнів"
                    />
                  </div>

                  <div className="admin-form__field">
                    <label className="admin-form__label">Модулі</label>
                    <input
                      type="text"
                      name="modules"
                      value={formData.modules}
                      onChange={handleInputChange}
                      className="admin-form__input"
                      placeholder="9 модулів"
                    />
                  </div>

                  <div className="admin-form__field">
                    <label className="admin-form__label">Теми</label>
                    <input
                      type="text"
                      name="themes"
                      value={formData.themes}
                      onChange={handleInputChange}
                      className="admin-form__input"
                      placeholder="25 тем"
                    />
                  </div>

                  <div className="admin-form__field">
                    <label className="admin-form__label">Куратори</label>
                    <input
                      type="text"
                      name="curators"
                      value={formData.curators}
                      onChange={handleInputChange}
                      className="admin-form__input"
                      placeholder="2 куратори"
                    />
                  </div>
                </>
              )}

              {/* Поля тільки для флагманського курсу */}
              {isFlagship && (
                <>

                  {/* Author Section */}
                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Ім&#39;я автора *</label>
                    <input
                      type="text"
                      name="authorName"
                      value={formData.authorName}
                      onChange={handleInputChange}
                      className="admin-form__input"
                      required
                      placeholder="КОМАР МИКОЛА"
                    />
                  </div>

                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Основна біографія *</label>
                    <textarea
                      name="authorBio1"
                      value={formData.authorBio1}
                      onChange={handleInputChange}
                      className="admin-form__textarea"
                      required
                      placeholder="МАГІСТР САДОВО-ПАРКОВОГО ГОСПОДАРСТВА ТА МИСТЕЦТВА. ПРАКТИКУЮЧИЙ ЛАНДШАФТНИЙ ДИЗАЙНЕР..."
                      rows="3"
                    />
                  </div>

                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Додаткова біографія</label>
                    <textarea
                      name="authorBio2"
                      value={formData.authorBio2}
                      onChange={handleInputChange}
                      className="admin-form__textarea"
                      placeholder="17 РОКІВ НА РИНКУ, СТОВРИВ 100+ САДІВ ВІД 30 М.КВ ДО 11 ГА."
                      rows="2"
                    />
                  </div>

                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">Фото автора</label>
                    <ImageUpload
                      name="authorPhoto"
                      value={formData.authorPhoto}
                      onChange={handleInputChange}
                    />
                    <small style={{ color: '#666', fontSize: '12px', marginTop: '8px', display: 'block' }}>
                      Завантажте фото автора або перетягніть його в поле вище
                    </small>
                  </div>

                  {/* Target Audience Section */}
                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">
                      Цільова аудиторія (можете додавати/видаляти пункти)
                    </label>

                    {targetAudience.map((item, index) => (
                      <div key={item.id} className="admin-form__list-item">
                        <div className="admin-form__list-item-number">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <textarea
                          value={item.text}
                          onChange={(e) => handleAudienceInputChange(index, e.target.value)}
                          className="admin-form__textarea admin-form__textarea--list"
                          rows="2"
                          placeholder="Введіть текст пункту списку"
                          required
                        />
                        {targetAudience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAudienceItem(index)}
                            className="admin-form__remove-button"
                            title="Видалити пункт"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addAudienceItem}
                      className="admin-form__add-button"
                    >
                      + Додати пункт
                    </button>
                  </div>

                  {/* Skills Section */}
                  <div className="admin-form__field admin-form__field--full">
                    <label className="admin-form__label">
                      Навички які ви зможете опанувати (можете додавати/видаляти пункти)
                    </label>

                    {formData.skills ? formData.skills.split('\n').map((skill, index) => (
                      <div key={index} className="admin-form__list-item">
                        <div className="admin-form__list-item-number">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <textarea
                          value={skill}
                          onChange={(e) => {
                            const newSkills = formData.skills.split('\n');
                            newSkills[index] = e.target.value;
                            setFormData({ ...formData, skills: newSkills.join('\n') });
                          }}
                          className="admin-form__textarea admin-form__textarea--list"
                          rows="2"
                          placeholder="Введіть навичку"
                          required
                        />
                        {formData.skills.split('\n').length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newSkills = formData.skills.split('\n');
                              newSkills.splice(index, 1);
                              setFormData({ ...formData, skills: newSkills.join('\n') });
                            }}
                            className="admin-form__remove-button"
                            title="Видалити навичку"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )) : (
                      <div className="admin-form__list-item">
                        <div className="admin-form__list-item-number">01</div>
                        <textarea
                          value=""
                          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                          className="admin-form__textarea admin-form__textarea--list"
                          rows="2"
                          placeholder="Введіть навичку"
                          required
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const currentSkills = formData.skills || '';
                        setFormData({ ...formData, skills: currentSkills + (currentSkills ? '\n' : '') + '' });
                      }}
                      className="admin-form__add-button"
                    >
                      + Додати навичку
                    </button>
                  </div>
                </>
              )}

              <div className="admin-form__field">
                <label className="admin-form__label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    style={{ width: 'auto', cursor: 'pointer' }}
                  />
                  Активний курс (відображається на сайті)
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                type="submit" 
                className="admin-form__button"
                disabled={isSaving}
              >
                {isSaving ? 'Збереження...' : (isEditing ? 'Оновити курс' : 'Додати курс')}
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

          {/* Courses List */}
          <div className="admin-list">
            <h2 className="admin-list__title">
              Список курсів ({courses.length})
            </h2>
            
            {courses.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                Курсів ще немає. Додайте перший курс!
              </p>
            ) : (
              courses.map(course => (
                <div key={course.id} className="admin-list__item">
                  <div className="admin-list__item-info">
                    <h3 className="admin-list__item-title">
                      {course.title}
                      {!course.is_active && <span style={{ color: '#dc3545', fontSize: '12px', marginLeft: '8px' }}>(неактивний)</span>}
                    </h3>
                    <p className="admin-list__item-description">
                      {getCourseTypeLabel(course.course_type)} • 
                      💰 {course.price} ₴ {course.old_price && `(${course.old_price} ₴)`} • 
                      📅 {course.start_date} • 
                      ⏱️ {course.duration}
                    </p>
                    {course.subtitle && (
                      <p className="admin-list__item-description" style={{ fontSize: '13px', marginTop: '4px', fontStyle: 'italic' }}>
                        {course.subtitle}
                      </p>
                    )}
                    <p className="admin-list__item-description" style={{ fontSize: '13px', marginTop: '4px' }}>
                      👤 {course.author_name}
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
                      className="admin-list__button"
                      onClick={() => handleEditProgram(course.id)}
                      style={{ background: '#28a745' }}
                    >
                      Програма
                    </button>
                    <button 
                      className="admin-list__button admin-list__button--danger"
                      onClick={() => handleDelete(course.id)}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Program Editor Modal */}
          {showProgramEditor && (
            <div className="admin-modal-overlay">
              <div className="admin-modal">
                <div className="admin-modal__header">
                  <h3 className="admin-modal__title">Редагування програми курсу</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProgramEditor(false);
                      setProgramCourseId(null);
                    }}
                    className="admin-modal__close"
                  >
                    ×
                  </button>
                </div>
                <div className="admin-modal__content">
                  <CourseProgramEditor
                    courseId={programCourseId}
                    onSave={() => {
                      setShowProgramEditor(false);
                      setProgramCourseId(null);
                    }}
                    onCancel={() => {
                      setShowProgramEditor(false);
                      setProgramCourseId(null);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminCourses;