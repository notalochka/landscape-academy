import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './MarkdownEditor.module.css';

const MarkdownEditor = ({ value, onChange, name }) => {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef(null);

  const insertMarkdown = (before, after = '') => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange({ target: { name, value: newText } });
    
    // Встановити курсор після вставки
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const toolbarButtons = [
    { label: 'H1', action: () => insertMarkdown('# ', '\n'), tooltip: 'Заголовок 1' },
    { label: 'H2', action: () => insertMarkdown('## ', '\n'), tooltip: 'Заголовок 2' },
    { label: 'H3', action: () => insertMarkdown('### ', '\n'), tooltip: 'Заголовок 3' },
    { label: 'B', action: () => insertMarkdown('**', '**'), tooltip: 'Жирний', bold: true },
    { label: 'I', action: () => insertMarkdown('*', '*'), tooltip: 'Курсив', italic: true },
    { label: 'Lista', action: () => insertMarkdown('- ', '\n'), tooltip: 'Список' },
    { label: 'Число', action: () => insertMarkdown('1. ', '\n'), tooltip: 'Нумерований список' },
    { label: 'Code', action: () => insertMarkdown('`', '`'), tooltip: 'Код', mono: true },
    { label: 'Quote', action: () => insertMarkdown('> ', '\n'), tooltip: 'Цитата' },
  ];

  return (
    <div className={styles.editor}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarButtons}>
          {toolbarButtons.map((btn, index) => (
            <button
              key={index}
              type="button"
              onClick={btn.action}
              className={`${styles.toolbarButton} ${btn.bold ? styles.bold : ''} ${btn.italic ? styles.italic : ''} ${btn.mono ? styles.mono : ''}`}
              title={btn.tooltip}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={styles.previewToggle}
        >
          {showPreview ? '✏️ Редагувати' : '👁️ Попередній перегляд'}
        </button>
      </div>

      {/* Editor/Preview */}
      <div className={styles.content}>
        {showPreview ? (
          <div className={styles.preview}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {value || '*Введіть текст для попереднього перегляду*'}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            name={name}
            value={value}
            onChange={onChange}
            className={styles.textarea}
            placeholder="# Заголовок статті&#10;&#10;Ваш текст тут...&#10;&#10;## Підзаголовок&#10;&#10;- Пункт списку&#10;- Ще один пункт&#10;&#10;**Жирний текст** та *курсив*"
          />
        )}
      </div>

      {/* Help */}
      <div className={styles.help}>
        <details className={styles.helpDetails}>
          <summary className={styles.helpSummary}>📖 Markdown шпаргалка</summary>
          <div className={styles.helpContent}>
            <div className={styles.helpItem}>
              <code># Заголовок 1</code>
              <span>Великий заголовок</span>
            </div>
            <div className={styles.helpItem}>
              <code>## Заголовок 2</code>
              <span>Середній заголовок</span>
            </div>
            <div className={styles.helpItem}>
              <code>**жирний**</code>
              <span><strong>Жирний текст</strong></span>
            </div>
            <div className={styles.helpItem}>
              <code>*курсив*</code>
              <span><em>Курсив</em></span>
            </div>
            <div className={styles.helpItem}>
              <code>- пункт списку</code>
              <span>Маркований список</span>
            </div>
            <div className={styles.helpItem}>
              <code>1. пункт</code>
              <span>Нумерований список</span>
            </div>
            <div className={styles.helpItem}>
              <code>`код`</code>
              <span>Інлайн код</span>
            </div>
            <div className={styles.helpItem}>
              <code>&gt; цитата</code>
              <span>Блок цитати</span>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default MarkdownEditor;

