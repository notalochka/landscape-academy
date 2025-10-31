import React, { useState, useEffect } from 'react';
import styles from './CourseProgramEditor.module.css';

const CourseProgramEditor = ({ courseId, onSave, onCancel }) => {
  const [program, setProgram] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProgram();
  }, [courseId]);

  const fetchProgram = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/program`);
      const result = await response.json();
      
      if (result.success) {
        setProgram(result.data);
      } else {
        setMessage({ type: 'error', text: 'Не вдалося завантажити програму курсу' });
      }
    } catch (error) {
      console.error('Помилка завантаження програми:', error);
      setMessage({ type: 'error', text: 'Помилка завантаження програми курсу' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`/api/courses/${courseId}/program`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ program }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Програма курсу успішно збережена!' });
        if (onSave) onSave();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Не вдалося зберегти програму курсу' });
      }
    } catch (error) {
      console.error('Помилка збереження:', error);
      setMessage({ type: 'error', text: 'Помилка збереження програми курсу' });
    } finally {
      setIsSaving(false);
    }
  };

  const addModule = () => {
    const newModule = {
      id: Date.now(),
      module_number: Math.max(...program.map(p => p.module_number), 0) + 1,
      module_title: `МОДУЛЬ ${Math.max(...program.map(p => p.module_number), 0) + 1}`,
      module_description: '',
      lesson_number: null,
      lesson_title: '',
      lesson_description: '',
      is_practical: false,
      isNew: true
    };
    setProgram([...program, newModule]);
  };

  const addLesson = (moduleIndex) => {
    const currentModule = program[moduleIndex];
    // Визначаємо наступний номер уроку у цьому модулі
    const lessonNumber = Math.max(
      ...program
        .filter(p => p.module_number === currentModule.module_number)
        .map(p => p.lesson_number || 0),
      0
    ) + 1;

    const newLesson = {
      id: Date.now(),
      module_number: currentModule.module_number,
      module_title: currentModule.module_title,
      lesson_number: lessonNumber,
      lesson_title: `Урок ${lessonNumber} - `,
      lesson_description: '',
      is_practical: false,
      isNew: true
    };

    // Знаходимо останній елемент цього модуля (модуль або останній урок) у плоскому списку
    const sameModuleIndices = program
      .map((item, idx) => ({ item, idx }))
      .filter(x => x.item.module_number === currentModule.module_number)
      .map(x => x.idx);

    const insertAfterIndex = sameModuleIndices.length > 0
      ? sameModuleIndices[sameModuleIndices.length - 1]
      : moduleIndex; // запасний варіант

    const newProgram = [...program];
    newProgram.splice(insertAfterIndex + 1, 0, newLesson);
    setProgram(newProgram);
  };

  const updateItem = (index, field, value) => {
    const newProgram = [...program];
    newProgram[index] = { ...newProgram[index], [field]: value };
    setProgram(newProgram);
  };

  const removeItem = (index) => {
    const newProgram = program.filter((_, i) => i !== index);
    setProgram(newProgram);
  };

  const moveItem = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const newProgram = [...program];
      [newProgram[index - 1], newProgram[index]] = [newProgram[index], newProgram[index - 1]];
      setProgram(newProgram);
    } else if (direction === 'down' && index < program.length - 1) {
      const newProgram = [...program];
      [newProgram[index], newProgram[index + 1]] = [newProgram[index + 1], newProgram[index]];
      setProgram(newProgram);
    }
  };

  const groupByModules = () => {
    const modules = {};
    program.forEach((item, index) => {
      if (!modules[item.module_number]) {
        modules[item.module_number] = {
          module: null,
          lessons: []
        };
      }
      
      if (item.lesson_number === null) {
        modules[item.module_number].module = { ...item, index };
      } else {
        modules[item.module_number].lessons.push({ ...item, index });
      }
    });
    
    return modules;
  };

  if (isLoading) {
    return (
      <div className={styles['course-program-editor']}>
        <div className={styles['course-program-editor__loading']}>
          Завантаження програми курсу...
        </div>
      </div>
    );
  }

  const modules = groupByModules();

  return (
    <div className={styles['course-program-editor']}>
      

      {message.text && (
        <div className={`${styles['course-program-editor__message']} ${styles[`course-program-editor__message--${message.type}`]}`}>
          {message.text}
        </div>
      )}

      <div className={styles['course-program-editor__content']}>
        {Object.keys(modules).sort((a, b) => parseInt(a) - parseInt(b)).map(moduleNumber => {
          const moduleData = modules[moduleNumber];
          const moduleIndex = moduleData.module?.index;
          
          return (
            <div key={moduleNumber} className={styles['course-program-editor__module']}>
              {/* Модуль */}
              {moduleData.module && (
                <div className={styles['course-program-editor__module-header']}>
                  <div className={styles['course-program-editor__module-controls']}>
                    <button
                      type="button"
                      onClick={() => moveItem(moduleIndex, 'up')}
                      disabled={moduleIndex === 0}
                      className={styles['course-program-editor__move-btn']}
                      title="Перемістити вгору"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(moduleIndex, 'down')}
                      disabled={moduleIndex === program.length - 1}
                      className={styles['course-program-editor__move-btn']}
                      title="Перемістити вниз"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(moduleIndex)}
                      className={styles['course-program-editor__remove-btn']}
                      title="Видалити модуль"
                    >
                      ×
                    </button>
                  </div>
                  
                   <div className={styles['course-program-editor__module-fields']}>
                     <div className={`${styles['course-program-editor__field']} ${styles['course-program-editor__field--full']}`}>
                       <label className={styles['course-program-editor__label']}>Назва модуля *</label>
                       <input
                         type="text"
                         value={moduleData.module.module_title}
                         onChange={(e) => updateItem(moduleIndex, 'module_title', e.target.value)}
                         className={styles['course-program-editor__input']}
                         placeholder="МОДУЛЬ 1"
                         required
                       />
                     </div>
                     
                     <div className={`${styles['course-program-editor__field']} ${styles['course-program-editor__field--full']}`}>
                       <label className={styles['course-program-editor__label']}>Опис модуля *</label>
                       <textarea
                         value={moduleData.module.module_description || ''}
                         onChange={(e) => updateItem(moduleIndex, 'module_description', e.target.value)}
                         className={styles['course-program-editor__textarea']}
                         placeholder="АНАЛІЗ СИТУАЦІЇ"
                         rows="2"
                         required
                       />
                     </div>
                   </div>
                  
                  <button
                    type="button"
                    onClick={() => addLesson(moduleIndex)}
                    className={styles['course-program-editor__add-lesson-btn']}
                  >
                    + Додати урок
                  </button>
                </div>
              )}

              {/* Уроки модуля */}
              {moduleData.lessons.map((lesson, lessonIndex) => (
                <div key={lesson.id} className={styles['course-program-editor__lesson']}>
                  <div className={styles['course-program-editor__lesson-controls']}>
                    <button
                      type="button"
                      onClick={() => moveItem(lesson.index, 'up')}
                      disabled={lesson.index === 0}
                      className={styles['course-program-editor__move-btn']}
                      title="Перемістити вгору"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(lesson.index, 'down')}
                      disabled={lesson.index === program.length - 1}
                      className={styles['course-program-editor__move-btn']}
                      title="Перемістити вниз"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(lesson.index)}
                      className={styles['course-program-editor__remove-btn']}
                      title="Видалити урок"
                    >
                      ×
                    </button>
                  </div>
                  
                   <div className={styles['course-program-editor__lesson-fields']}>
                     <div className={`${styles['course-program-editor__field']} ${styles['course-program-editor__field--full']}`}>
                       <label className={styles['course-program-editor__label']}>Назва уроку *</label>
                       <input
                         type="text"
                         value={lesson.lesson_title || ''}
                         onChange={(e) => updateItem(lesson.index, 'lesson_title', e.target.value)}
                         className={styles['course-program-editor__input']}
                         placeholder="Урок 1 - СИТУАЦІЯ НА РИНКУ"
                         required
                       />
                     </div>
                     
                     <div className={`${styles['course-program-editor__field']} ${styles['course-program-editor__field--full']}`}>
                       <label className={styles['course-program-editor__label']}>Опис уроку *</label>
                       <textarea
                         value={lesson.lesson_description || ''}
                         onChange={(e) => updateItem(lesson.index, 'lesson_description', e.target.value)}
                         className={styles['course-program-editor__textarea']}
                         placeholder="( НАША РЕАЛЬНІСТЬ, ТРЕНДИ, ПРОБЛЕМИ ТА МОЖЛИВОСТІ)"
                         rows="2"
                         required
                       />
                     </div>
                   </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className={styles['course-program-editor__header']}>
        <div className={styles['course-program-editor__actions']}>
          <button
            type="button"
            onClick={addModule}
            className={styles['course-program-editor__add-module-btn']}
          >
            + Додати модуль
          </button>
        </div>
      </div>

      <div className={styles['course-program-editor__footer']}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={styles['course-program-editor__save-btn']}
        >
          {isSaving ? 'Збереження...' : 'Зберегти програму'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={styles['course-program-editor__cancel-btn']}
          >
            Скасувати
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseProgramEditor;