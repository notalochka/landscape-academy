import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { pagesSEO } from "../../config/seo";

const Course1Page = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [targetRef, targetVisible] = useScrollAnimation({ threshold: 0.1 });
  const [authorRef, authorVisible] = useScrollAnimation({ threshold: 0.1 });
  const [skillsRef, skillsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [questionsRef, questionsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [programRef, programVisible] = useScrollAnimation({ threshold: 0.1 });
  
  const course1SEO = {
    title: "ШІ РЕНДЕР НА ТЕЛЕФОНІ - LANDSCAPER Academy",
    description: "Детальна інформація про курс ШІ РЕНДЕР НА ТЕЛЕФОНІ від LANDSCAPER Academy",
    keywords: "ШІ рендер, телефон, ландшафтний дизайн, курс, LANDSCAPER Academy",
    ogImage: "/images/og-course-1.jpg",
    canonical: "/course-1"
  };

  return (
    <>
      <SEO
        title={course1SEO.title}
        description={course1SEO.description}
        keywords={course1SEO.keywords}
        ogImage={course1SEO.ogImage}
        canonical={course1SEO.canonical}
      />

      {/* Header Section */}
      <Header showBanner={false} />

      {/* Course Details Section */}
      <section className="la-course-1">
      <Link href="/courses" className="la-course-1__back-link">
            <div className="la-course-1__back-arrow">
              <span></span>
            </div>
            <span>ПОВЕРНУТИСЯ НАЗАД</span>
            
          </Link>
        <div className="la-course-1__container">
          
          
          <div className="la-course-1__content">
            <div className="la-course-1__left">
              <p className="la-course-1__program-label">ПРОГРАМА</p>
              <h1 className="la-course-1__title">ШІ РЕНДЕР НА ТЕЛЕФОНІ</h1>
              <p className="la-course-1__subtitle">ВІД ЕСКІЗУ ДО WOW ЗА 5 ХВИЛИН</p>
            </div>
            
            <div className="la-course-1__right">
              <div className="la-course-1__info-box">
                <div className="la-course-1__info-content">
                  <p className="la-course-1__info-item">ДОСВІД</p>
                  <p className="la-course-1__info-item-date">20.09.2025</p>
                  <p className="la-course-1__info-item">СТАРТ</p>
                  <p className="la-course-1__info-item-date">20.09.2025</p>
                  <p className="la-course-1__info-item">ГРУПА</p>
                  <p className="la-course-1__info-item-date">20.09.2025</p>
                  <p className="la-course-1__info-item">ТРИВАЛІСТЬ</p>
                  <p className="la-course-1__info-item-date">20.09.2025</p>
                </div>
                <button className="la-course-1__button">
                  ЗАПИСАТИСЯ НА КУРС
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="la-course-1__problem">
        <div className="la-course-1__problem-container">
          <h2 className="la-course-1__problem-title">
            КОЛИ КЛІЄНТ КАЖЕ &quot;НЕ РОЗУМІЮ, ЯК ЦЕ ВИГЛЯДАТИМЕ&quot;
          </h2>
          <div className="la-course-1__problem-content">
            <div className="la-course-1__problem-left">
              <div className="la-course-1__problem-text">
                <p>
    Знайома ситуація? Ви показуєте креслення свого проєкту, пояснюєте кожну деталь, а клієнт дивиться на папір з виразом &quot;я нічого не бачу&quot;. Тому що люди не читають креслення — вони дивляться на картинки.

             </p>
                <p>Клієнти приймають рішення серцем, а не розумом. Їм потрібно ПОБАЧИТИ, як їхній простір оживе. І якщо цієї картинки немає — немає і продажу.
                </p>
              </div>
            </div>
            <div className="la-course-1__problem-right">
              <div className="la-course-1__problem-square"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Result Section */}
      <section className="la-course-1__result">
        <div className="la-course-1__result-container">
          <h2 className="la-course-1__result-title">Раніше якісна візуалізація означала:
          </h2>
          </div>
          <div className="la-course-1__result-line"></div>
          <div className="la-course-1__result-container">
          <ul className="la-course-1__result-list">
            <li>Години роботи в 3ds Max або SketchUp</li>
            <li>Потужний комп&apos;ютер, який гуде як літак</li>
            <li>Купу плагінів та налаштувань</li>
            <li>І все одно результат не завжди вражає</li>
          </ul>
          </div>
          <div className="la-course-1__result-block">
            <p>Результат? Більшість дизайнерів показують клієнтам &quot;сирі&quot; ескізи або купують дорогі рендери на стороні.</p>
          </div>
        
       </section>

       {/* Solution Section */}
       <section className="la-course-1__solution">
         <div className="la-course-1__solution-container">
           <h2 className="la-course-1__solution-title">
             РІШЕННЯ ЗА НЕЙРОМЕРЕЖАМИ ТА ШТУЧНИМ ІНТЕЛЕКТОМ.
           </h2>
           <p className="la-course-1__solution-description">
             МИ СТВОРИЛИ LANDSCAPER RENDER ASSISTANT НА БАЗІ CHATGPT, ЯКИЙ РОЗУМІЄ СПЕЦИФІКУ ЛАНДШАФТНОГО ДИЗАЙНУ. ВІН НЕ ПРОСТО ПОКРАЩУЄ КАРТИНКУ — ВІН МИСЛИТЬ ЯК ПРОФЕСІОНАЛ.
           </p>
           <p className="la-course-1__solution-description">ЯК ЦЕ ПРАЦЮЄ</p>
           <div className="la-course-1__solution-block">
             <ul className="la-course-1__solution-list">
               <li>РОБИТЕ ФОТО ЕСКІЗУ НА ТЕЛЕФОН (АБО ЗАВАНТАЖУЄТЕ ФАЙЛ)</li>
               <li>ВІДПРАВЛЯЄТЕ В НАШ ШІ-АСИСТЕНТ</li>
               <li>ЧЕРЕЗ 3-5 ХВИЛИН ОТРИМУЄТЕ РЕНДЕР, ЯКИЙ ХОЧЕТЬСЯ ПОКАЗАТИ ВСІМ</li>
             </ul>
           </div>
           <p className="la-course-1__solution-conclusion">
             БЕЗ СКЛАДНИХ ПРОГРАМ. БЕЗ ПОТУЖНОГО КОМП&apos;ЮТЕРА. ПРЯМО НА ТЕЛЕФОНІ.
           </p>
         </div>
       </section>

       {/* Target Audience Section */}
      <section ref={targetRef} className={`la-course-1-target animate-fade-in-up ${targetVisible ? 'is-visible' : ''}`}>
        <div className="la-course-1-target__inner">
            <h2 className="la-course-1-target__title">ДЛЯ КОГО ЦЕЙ КУРС?</h2>
        </div>

        <div className="la-course-1-target__line"></div>
        <div className="la-course-1-target__inner">  
          <div className="la-course-1-target__content">
            <div className="la-course-1-target__list">
              <div className="la-course-1-target__item">
                <span className="la-course-1-target__number">01</span>
                <p className="la-course-1-target__text">
                Ландшафтним дизайнерам, які втомилися від &quot;а покажіть, як це виглядатиме&quot;
                </p>
              </div>
              <div className="la-course-1-target__item">
                <span className="la-course-1-target__number">02</span>
                <p className="la-course-1-target__text">
                Архітекторам, які хочуть презентувати зовнішній вигляд будівельЄ ПОКРАЩИТИ СВОЇ НАВИЧКИ З ДИЗАЙНУ
                </p>
              </div>
              <div className="la-course-1-target__item">
                <span className="la-course-1-target__number">03</span>
                <p className="la-course-1-target__text">
                Інтер&apos;єрним дизайнерам для зонування приватних територій
                </p>
              </div>
              <div className="la-course-1-target__item">
                <span className="la-course-1-target__number">04</span>
                <p className="la-course-1-target__text">
                Всім, хто працює з простором і хоче продавати ідеї, а не пояснювати їх
                </p>
              </div>
              
            </div>
            
            <div className="la-course-1-target__block"></div>
          </div>
        </div>
        
      </section>

      {/* Author Section */}
      <section ref={authorRef} className={`la-course-1-author animate-fade-in-up ${authorVisible ? 'is-visible' : ''}`}>
        <div className="la-course-1-author__inner">
          <div className="la-course-1-author__content">
            <div className="la-course-1-author__info">
              <div className="la-course-1-author__header">
                <div className="la-course-1-author__logo">
                  <Image
                    src="/logo_academy.png"
                    alt="Landscape Academy"
                    width={73}
                    height={72}
                  />
                </div>
                <span className="la-course-1-author__label">АВТОР КУРСУ</span>
              </div>
              
              <h2 className="la-course-1-author__name">Катерина Комар</h2>
              
              <div className="la-course-1__author__description">
              <ul className="la-course-1__author__description">
                <li>Магістр садово-паркового дизайну </li>
                <li>Співзасновниця LANDSCAPER Academy</li>
                <li>8+ років досвіду в маркетингу для особистих брендів</li>
                <li>2+ роки впроваджує ШІ-технології в роботу команди</li>
                <li>маю сертифікат від Google по Основам ШІ</li>
              </ul>
              </div>
              
              <div className="la-course-1-author__buttons">
                <button className="la-course-1-author__button">ЗВ&apos;ЯЗАТИСЯ</button>
                <button className="la-course-1-author__button">ПРО КУРС</button>
              </div>
            </div>
          </div>
          
          <div className="la-course-1-author__photo">
            <Image
              src="/ai-author-photo.png"
              alt="Комар Микола"
              width={611}
              height={833}
              className="la-course-1-author__image"
            />
          </div>
        </div>
        <div className="la-course-1-author__conclusion">
          <p>Я не навчаю робити рендери з нуля в Blender або 3ds Max. Я показую, як покращити ваші існуючі візуалізації на рівень, який працює на ваш бізнес і репутацію.
          </p>
        </div>
      </section>

      <section ref={skillsRef} className={`la-course-1-skills animate-fade-in-up ${skillsVisible ? 'is-visible' : ''}`}>
        <div className="la-course-1-skills__inner">
            <h2 className="la-course-1-skills__title">Особливо корисно, якщо ви:</h2>
        </div>

        <div className="la-course-1-skills__line"></div>

        <div className="la-course-1-skills__inner">
          <ul className="la-course-1-skills__list">
            <li className="la-course-1-skills__item">
            Не маєте часу вчити складні програми для рендерингу
            </li>
            <li className="la-course-1-skills__item">
            Хочете вражати клієнтів вже на першій зустрічі
            </li>
            <li className="la-course-1-skills__item">
            Втомилися програвати конкурентам через &quot;некрасиві&quot; презентації
            </li>
            <li className="la-course-1-skills__item">
            Розумієте, що візуалізація — це 50% успіху продажу
            </li>
          </ul>
        </div>

        <div className="la-course-1-skills__line"></div>

      
      </section>

      {/* Contact Questions Section */}
      <section ref={questionsRef} className={`la-course-1-contact-questions animate-fade-in-up ${questionsVisible ? 'is-visible' : ''}`}>
        <div className="la-course-1-contact-questions__inner">
          <div className="la-course-1-contact-questions__block"></div>
          <div className="la-course-1-contact-questions__content">
            <h2 className="la-course-1-contact-questions__text">ВІДПОВІМО ВАМ НА ВСІ ПИТАННЯ</h2>
            <div className="la-course-1-contact-questions__buttons">
              <button className="la-course-1-contact-questions__button">ЗАТЕЛЕФОНУЙТЕ НАМ</button>
              <button className="la-course-1-contact-questions__button">НАПИСАТИ В TELEGRAM</button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Program Section */}
      <section ref={programRef} className={`la-course-1-course-program animate-fade-in-up ${programVisible ? 'is-visible' : ''}`}>
        <div className="la-course-1-course-program__inner">
          <div className="la-course-1-course-program__header">
            <div className="la-course-1-course-program__left">
              <p className="la-course-1-course-program__motto">
                Від ескізу до WOW<br />за 5 хвилин
              </p>
            </div>
            <div className="la-course-1-course-program__right">
              <h2 className="la-course-1-course-program__title">Що входить в курс</h2>
              <div className="la-course-1-course-program__schedule">
                <p className="la-course-1-course-program__schedule-text"></p>
                <p className="la-course-1-course-program__schedule-text"></p>
                <p className="la-course-1-course-program__schedule-text"></p>
              </div>
            </div>
          </div>
          
          <div className="la-course-1-course-program__line"></div>
          
          <div className="la-course-1-course-program__toggle">
            <h3 className="la-course-1-course-program__course-title">
            курс: ШІ рендер на телефоні
            </h3>
            <button 
              className="la-course-1-course-program__toggle-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label={isDropdownOpen ? 'Закрити програму' : 'Відкрити програму'}
            >
              <span className={isDropdownOpen ? 'la-course-1-course-program__toggle-icon open' : 'la-course-1-course-program__toggle-icon'}>
                <span></span>
              </span>
            </button>
          </div>
          
          {isDropdownOpen && (
            <>
              <div className="la-course-1-course-program__line"></div>
              
              <div className="la-course-1-course-program__content">
                <div className="la-course-1-course-program__module">
                  <div className="la-course-1-course-program__module-info">
                    <h4 className="la-course-1-course-program__module-number">3 практичні уроки</h4>
                    <h5 className="la-course-1-course-program__module-title">в записі:</h5>
                  </div>
                  
                  <div className="la-course-1-course-program__lessons">
                    <ul className="la-course-1-course-program__lesson-list">
                      <li className="la-course-1-course-program__lesson">
                        <p className="la-course-1-course-program__lesson-title">
                        Урок 1: Що таке ШІ і як він працює для дизайнерів
                        </p>
                      </li>
                      
                      <li className="la-course-1-course-program__lesson">
                        <p className="la-course-1-course-program__lesson-title">
                        Урок 2: Як створювати візуалізацію за допомогою GPT
                        </p>
                      </li>
                      
                      <li className="la-course-1-course-program__lesson">
                        <p className="la-course-1-course-program__lesson-title">
                        Урок 3: Як використовувати промпти на різних платформах
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="la-course-1-course-program__line"></div>
              
              <div className="la-course-1-course-program__content">
                <div className="la-course-1-course-program__module">
                  <div className="la-course-1-course-program__module-info">
                    <h4 className="la-course-1-course-program__module-number"></h4>
                  </div>
                  
                  <div className="la-course-1-course-program__lessons">
                    <ul className="la-course-1-course-program__lesson-list">
                      <li className="la-course-1-course-program__lesson">
                        <p className="la-course-1-course-program__lesson-title">
                        Доступ до LANDSCAPER Render Assistant
                        </p>
                      </li>
                      
                      <li className="la-course-1-course-program__lesson">
                        <p className="la-course-1-course-program__lesson-title">
                        Закритий Telegram-чат з підтримкою та живими кейсами
                        </p>
                      </li>
                      
                      <li className="la-course-1-course-program__lesson">
                        <p className="la-course-1-course-program__lesson-title">
                        Галерея &quot;До і після&quot; — реальні роботи студентів
                        </p>
                      </li>
                      <li className="la-course-1-course-program__lesson">
                        <p className="la-course-1-course-program__lesson-title">
                        Шаблони промптів для різних стилів
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="la-course-1-course-program__line"></div>
              
              
              <div className="la-course-1-course-program__content">
                <h4 className="la-course-1-course-program__module-conclusion">ВАЖЛИВО: в безкоштовній версії ChatGPT ви зможете робити 2 рендера в день. Якщо необхідно більше - потрбно додатково платна версія ChatGPT 20$.
                </h4>
              </div>

            </>
          )}
        </div>
        <div className="la-course-1-course-program__line"></div>
      </section>

       {/* Order Section */}
       <section className="la-course-1-order">
         <div className="la-course-1-order__inner">
           <div className="la-course-1-order__content">
             <p className="la-course-1-order__text">
               ШІ НЕ ЗАМІНИТЬ ВАШУ ТВОРЧІСТЬ — ВІН ПІДСИЛИТЬ ЇЇ.
             </p>
             <p className="la-course-1-order__text">
               ВАШІ ІДЕЇ + ПОТУЖНІСТЬ ШТУЧНОГО ІНТЕЛЕКТУ = ПРОЄКТИ, ЯКІ ПРОДАЮТЬ СЕБЕ САМІ.
             </p>
             <p className="la-course-1-order__text">
               LANDSCAPER ACADEMY — ДЕ ПРАКТИЧНІ НАВИЧКИ ЗУСТРІЧАЮТЬСЯ З ТЕХНОЛОГІЯМИ МАЙБУТНЬОГО.
             </p>
           </div>
           
           <div className="la-course-1-order__card">
             <h2 className="la-course-1-order__title">КУРС: ШІ РЕНДЕР НА ТЕЛЕФОНІ</h2>
             <p className="la-course-1-order__start-date">СТАРТ 20.01.2025</p>
             
             <div className="la-course-1-order__pricing">
               <span className="la-course-1-order__old-price">2500 ГРН</span>
               <span className="la-course-1-order__new-price">1000 ГРН</span>
             </div>
             
             <button className="la-course-1-order__button">
               ЗАМОВИТИ
             </button>
           </div>
         </div>
       </section>

       {/* Contact Section */}
       <div>
         <Contact />
       </div>
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default Course1Page;

