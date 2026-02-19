import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './MarkdownEditor.module.css';

const UPLOAD_IMAGE_API = '/api/upload/blog';

/** URL для зображень з uploads — через API, щоб працювало в прев’ю та без ребілду */
function uploadsImageSrc(src) {
  if (!src || typeof src !== 'string') return src;
  return src.startsWith('/uploads/') ? `/api${src}` : src;
}

const IMAGE_SIZE_MIN = 200;
const IMAGE_SIZE_MAX = 1000;
const IMAGE_SIZE_DEFAULT = 480;

function parseImageAlt(alt) {
  if (!alt || typeof alt !== 'string') return { alt: '', size: null };
  const parts = alt.split(/\s*\|\s*/);
  const last = parts[parts.length - 1]?.trim();
  const numMatch = last?.match(/^(\d+)(px)?$/i);
  if (numMatch) {
    const caption = parts.slice(0, -1).join(' | ').trim();
    return { alt: caption, size: parseInt(numMatch[1], 10) };
  }
  const preset = last?.toLowerCase();
  const valid = ['small', 'medium', 'large', 'full'];
  if (valid.includes(preset)) {
    const caption = parts.slice(0, -1).join(' | ').trim();
    return { alt: caption, size: preset };
  }
  return { alt: alt.trim(), size: null };
}

const presetToPx = { small: 220, medium: 480, large: 720, full: 1000 };

/** Розбиває контент на сегменти: текст і зображення (url, alt, size в px) */
function parseContentToSegments(content) {
  if (!content || typeof content !== 'string') return [{ type: 'text', value: '' }];
  const segments = [];
  const re = /!\[([^\]]*)\]\s*\(\s*([^)]+)\s*\)/g;
  let lastEnd = 0;
  let m;
  while ((m = re.exec(content)) !== null) {
    segments.push({ type: 'text', value: content.slice(lastEnd, m.index) });
    const rawAlt = m[1];
    const url = m[2].trim();
    const { alt: caption, size } = parseImageAlt(rawAlt);
    const sizePx = typeof size === 'number' ? size : (presetToPx[size] ?? IMAGE_SIZE_DEFAULT);
    segments.push({ type: 'image', url, alt: caption || 'Зображення', size: sizePx });
    lastEnd = re.lastIndex;
  }
  segments.push({ type: 'text', value: content.slice(lastEnd) });
  return segments;
}

function serializeSegments(segments) {
  return segments.map((s) => {
    if (s.type === 'text') return s.value;
    return `![${s.alt || 'Зображення'} | ${s.size}](${s.url})`;
  }).join('');
}

const previewImageSizes = {
  img: ({ node, src, alt, ...props }) => {
    const { alt: cleanAlt, size } = parseImageAlt(alt);
    const isPx = typeof size === 'number';
    const style = isPx ? { maxWidth: `${size}px` } : undefined;
    const sizeClass = !isPx && presetToPx[size] != null
      ? styles[`previewImg${size.charAt(0).toUpperCase() + size.slice(1)}`]
      : styles.previewImgMedium;
    return (
      <img
        src={uploadsImageSrc(src)}
        alt={cleanAlt || ''}
        className={`${styles.previewImg} ${!isPx ? sizeClass : ''}`}
        style={style}
        {...props}
      />
    );
  },
};

const MarkdownEditor = ({ value, onChange, name }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [imageSizePx, setImageSizePx] = useState(IMAGE_SIZE_DEFAULT);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const insertMarkdown = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange({ target: { name, value: newText } });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const insertAtCursor = (text) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = value.substring(0, start) + text + value.substring(end);
    onChange({ target: { name, value: newText } });
    setTimeout(() => {
      textarea.focus();
      const pos = start + text.length;
      textarea.setSelectionRange(pos, pos);
    }, 0);
  };

  const segments = parseContentToSegments(value);

  const updateSegment = (index, newValue) => {
    const next = segments.map((s, i) => (i === index ? { ...s, value: newValue } : s));
    onChange({ target: { name, value: serializeSegments(next) } });
  };

  const updateImageSize = (index, newSize) => {
    const next = segments.map((s, i) => (i === index && s.type === 'image' ? { ...s, size: newSize } : s));
    onChange({ target: { name, value: serializeSegments(next) } });
  };

  const handleInsertImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Розмір файлу не повинен перевищувати 5MB');
      e.target.value = '';
      return;
    }
    setUploading(true);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch(UPLOAD_IMAGE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Помилка завантаження');
      }
      const alt = file.name.replace(/\.[^.]+$/, '');
      setImageSizePx(IMAGE_SIZE_DEFAULT);
      setPendingImage({ url: data.url, alt });
    } catch (err) {
      alert(err.message || 'Не вдалося завантажити зображення');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const insertImageWithSize = (sizePx) => {
    if (!pendingImage) return;
    const { url, alt } = pendingImage;
    const shortAlt = /^IMAGE\s+\d{4}/i.test(alt) || alt.length > 40 ? 'Зображення' : alt;
    const markdown = `![${shortAlt} | ${sizePx}](${url})`;
    const newContent = value ? `${value}\n\n${markdown}\n\n` : `\n\n${markdown}\n\n`;
    onChange({ target: { name, value: newContent } });
    setPendingImage(null);
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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFile}
        style={{ display: 'none' }}
        aria-hidden
      />
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
          <button
            type="button"
            onClick={handleInsertImage}
            disabled={uploading}
            className={styles.toolbarButton}
            title="Вставити зображення в текст (будь-де в статті)"
          >
            {uploading ? '…' : '🖼️ Зображення'}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={styles.previewToggle}
        >
          {showPreview ? '✏️ Редагувати' : '👁️ Попередній перегляд'}
        </button>
      </div>

      {/* Фото з повзунком: одразу показуємо картинку, повзунок знизу динамічно змінює розмір */}
      {pendingImage && (
        <div className={styles.imageSizeBlock}>
          <div className={styles.imageSizePreview}>
            <img
              src={uploadsImageSrc(pendingImage.url)}
              alt={pendingImage.alt}
              className={styles.imageSizePreviewImg}
              style={{ maxWidth: `${imageSizePx}px` }}
            />
          </div>
          <div className={styles.imageSizeBar}>
            <span className={styles.imageSizeLabel}>{imageSizePx} px</span>
            <input
              type="range"
              min={IMAGE_SIZE_MIN}
              max={IMAGE_SIZE_MAX}
              step={10}
              value={imageSizePx}
              onChange={(e) => setImageSizePx(Number(e.target.value))}
              className={styles.imageSizeSlider}
            />
            <button
              type="button"
              onClick={() => insertImageWithSize(imageSizePx)}
              className={styles.imageSizeInsert}
            >
              Вставити в текст
            </button>
            <button
              type="button"
              onClick={() => setPendingImage(null)}
              className={styles.imageSizeCancel}
              title="Скасувати"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Editor/Preview */}
      <div className={styles.content}>
        {showPreview ? (
          <div className={styles.preview}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={previewImageSizes}>
              {value || '*Введіть текст для попереднього перегляду*'}
            </ReactMarkdown>
          </div>
        ) : (
          <div className={styles.segments}>
            {segments.map((seg, index) =>
              seg.type === 'text' ? (
                <textarea
                  key={index}
                  ref={index === 0 ? textareaRef : undefined}
                  name={name}
                  value={seg.value}
                  onChange={(e) => updateSegment(index, e.target.value)}
                  className={styles.textarea}
                  placeholder={index === 0 ? '# Заголовок статті\u000a\u000aВаш текст...\u000a\u000a## Підзаголовок\u000a\u000a**жирний** та *курсив*' : ''}
                />
              ) : (
                <div key={index} className={styles.inlineImageBlock}>
                  <div className={styles.inlineImagePreview}>
                    <img
                      src={uploadsImageSrc(seg.url)}
                      alt={seg.alt}
                      className={styles.inlineImageImg}
                      style={{ maxWidth: `${seg.size}px` }}
                    />
                  </div>
                  <div className={styles.inlineImageBar}>
                    <span className={styles.inlineImageLabel}>{seg.size} px</span>
                    <input
                      type="range"
                      min={IMAGE_SIZE_MIN}
                      max={IMAGE_SIZE_MAX}
                      step={10}
                      value={seg.size}
                      onChange={(e) => updateImageSize(index, Number(e.target.value))}
                      className={styles.imageSizeSlider}
                    />
                  </div>
                </div>
              )
            )}
          </div>
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
            <div className={styles.helpItem}>
              <code>🖼️ Зображення</code>
              <span>Вставка фото з вибором розміру: малий, середній, великий, вся ширина</span>
            </div>
            <div className={styles.helpItem}>
              <code>![опис | 400]</code>
              <span>Ширина в пікселях (повзунок або вручну)</span>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default MarkdownEditor;

