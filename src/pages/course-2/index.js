import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { pagesSEO } from "../../config/seo";

const Course2Page = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [targetRef, targetVisible] = useScrollAnimation({ threshold: 0.1 });
  const [authorRef, authorVisible] = useScrollAnimation({ threshold: 0.1 });
  const [skillsRef, skillsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [questionsRef, questionsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [programRef, programVisible] = useScrollAnimation({ threshold: 0.1 });
  
  const course2SEO = {
    title: "Метод роботи практикуючого ландшафтного дизайнера",
    description: "Детальна інформація про курс Метод роботи практикуючого ландшафтного дизайнера",
    keywords: "Метод роботи дизайнера, телефон, ландшафтний дизайн, курс, LANDSCAPER Academy",
    ogImage: "/images/og-course-2.jpg",
    canonical: "/course-2"
  };

  return (
    <>
      <SEO
        title={course2SEO.title}
        description={course2SEO.description}
        keywords={course2SEO.keywords}
        ogImage={course2SEO.ogImage}
        canonical={course2SEO.canonical}
      />

      {/* Header Section */}
      <Header showBanner={false} />

      {/* Course Details Section */}
      <section className="la-course-2">
      <Link href="/courses" className="la-course-2__back-link">
            <div className="la-course-2__back-arrow">
              <span></span>
            </div>
            <span>ПОВЕРНУТИСЯ НАЗАД</span>
            
          </Link>
        <div className="la-course-2__container">
          
          
          <div className="la-course-2__content">
            <div className="la-course-2__left">
              <p className="la-course-2__program-label">ПРОГРАМА</p>
              <h1 className="la-course-2__title">МЕТОД РОБОТИ ПРАКТИКУЮЧОГО ЛАНДШАФТНОГО ДИЗАЙНЕРА</h1>
              <p className="la-course-2__subtitle">або в чому секрет виходу на високий чек</p>
            </div>
            
            <div className="la-course-2__right">
              <div className="la-course-2__info-box">
                <div className="la-course-2__info-content">
                  <p className="la-course-2__info-item">ДОСВІД</p>
                  <p className="la-course-2__info-item-date">20.09.2025</p>
                  <p className="la-course-2__info-item">СТАРТ</p>
                  <p className="la-course-2__info-item-date">20.09.2025</p>
                  <p className="la-course-2__info-item">ГРУПА</p>
                  <p className="la-course-2__info-item-date">20.09.2025</p>
                  <p className="la-course-2__info-item">ТРИВАЛІСТЬ</p>
                  <p className="la-course-2__info-item-date">20.09.2025</p>
                </div>
                <button className="la-course-2__button">
                  ЗАПИСАТИСЯ НА КУРС
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="la-course-2__problem">
        <div className="la-course-2__problem-container">
          <h2 className="la-course-2__problem-title">
            КОЛИ КЛІЄНТ КАЖЕ "НЕ РОЗУМІЮ, ЯК ЦЕ ВИГЛЯДАТИМЕ"
          </h2>
          <div className="la-course-2__problem-content">
            <div className="la-course-2__problem-left">
              <div className="la-course-2__problem-text">
                <p>ЗНАЙОМА СИТУАЦІЯ? ВИ ТИЖНЯМИ ПРАЦЮЄТЕ НАД ЕСКІЗОМ, ПРЕЗЕНТУЄТЕ КЛІЄНТУ, А ВІН КАЖЕ:</p>
                <p>«ЩОСЬ НЕ ТЕ… ДАВАЙТЕ ЩЕ ПОДУМАЄМО» АБО ГІРШЕ: «А МОЖНА, ЯК У СУСІДІВ, ТІЛЬКИ ДЕШЕВШЕ?»</p>
                <p>ВИ ВІДЧУВАЄТЕ СЕБЕ НОВАЧКОМ, НАВІТЬ МАЮЧИ ДОСВІД.</p>
                <p>ПРОЕКТИ ПЕРЕТВОРЮЮТЬСЯ НА НЕСКІНЧЕННІ ПРАВКИ, КЛІЄНТ НЕ РОЗУМІЄ, ЗА ЩО ПЛАТИТЬ, А ВИ — ЯК ВИРВАТИСЯ З КОЛА НИЗЬКИХ ЧЕКІВ І БЕЗКІНЕЧНИХ «ДОРОБОК».</p>
                <p>ГОЛОВНА ПОМИЛКА БІЛЬШОСТІ ЛАНДШАФТНИХ ДИЗАЙНЕРІВ — ПОЧИНАТИ З МАЛЮВАННЯ. КЛІЄНТ ДЗВОНИТЬ, ВИ ВИЇЖДЖАЄТЕ НА ДІЛЯНКУ І ОДРАЗУ ОБІЦЯЄТЕ: «ЗРОБЛЮ КРАСИВО!»</p>
              </div>
            </div>
            <div className="la-course-2__problem-right">
              <div className="la-course-2__problem-square"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Result Section */}
      <section className="la-course-2__result">
        <div className="la-course-2__result-container">
          <h2 className="la-course-2__result-title">Результат передбачуваний:
          </h2>
          </div>
          <div className="la-course-2__result-line"></div>
          <div className="la-course-2__result-container">
          <ul className="la-course-2__result-list">
            <li>Клієнт не розуміє процес і вартість</li>
            <li>Ви працюєте без системи та договору
            </li>
            <li>Кожен проєкт — це стресові правки
            </li>
            <li>Ціни низькі, бо немає обґрунтування вартості
            </li>
            <li>Клієнти сприймають вас як "озеленювача", а не дизайнера</li>
          </ul>
          </div>
          <div className="la-course-2__result-block">
            <p>Успішні ландшафтні дизайнери з високими чеками мають одну спільну рису — вони працюють за системою. У них є чіткий алгоритм від першого дзвінка до затвердження генерального плану.
            </p>
          </div>
        
       </section>
       {/* Target Audience Section */}
      <section ref={targetRef} className={`la-course-2-target animate-fade-in-up ${targetVisible ? 'is-visible' : ''}`}>
        <div className="la-course-2-target__inner">
            <h2 className="la-course-2-target__title">ДЛЯ КОГО ЦЕЙ КУРС?</h2>
        </div>
        <div className="la-course-2-target__line"></div>
        <div className="la-course-2-target__inner">  
          <div className="la-course-2-target__content">
            <div className="la-course-2-target__list">
              <div className="la-course-2-target__item">
                <span className="la-course-2-target__number">01</span>
                <p className="la-course-2-target__text">
                Початківцям в ландшафтному дизайні — отримаєте готову систему роботи з клієнтами без років болючих помилок.
                </p>
              </div>
              <div className="la-course-2-target__item">
                <span className="la-course-2-target__number">02</span>
                <p className="la-course-2-target__text">
                Досвідченим дизайнерам — структуруєте хаотичний процес і піднімете ціни завдяки професійному підходу. 
                </p>
              </div>
              <div className="la-course-2-target__item">
                <span className="la-course-2-target__number">03</span>
                <p className="la-course-2-target__text">
                Архітекторам та 3D-візуалізаторам — розширите послуги ландшафтним проєктуванням з готовою методологією.
                </p>
              </div>
              <div className="la-course-2-target__item">
                <span className="la-course-2-target__number">04</span>
                <p className="la-course-2-target__text">
                Фрілансерам — перестанете шукати клієнтів і почнете їх вибирати завдяки репутації професіонала.
                </p>
              </div>
              <div className="la-course-2-target__item">
                <span className="la-course-2-target__number">05</span>
                <p className="la-course-2-target__text">
                Студентам профільних спеціальностей — підготуєтеся до практики з інструментами, які працюють вже зараз.
                </p>
              </div>
              
            </div>
            
            <div className="la-course-2-target__block"></div>
          </div>
        </div>
        
      </section>

      {/* Author Section */}
      <section ref={authorRef} className={`la-course-2-author animate-fade-in-up ${authorVisible ? 'is-visible' : ''}`}>
        <div className="la-course-2-author__inner">
          <div className="la-course-2-author__content">
            <div className="la-course-2-author__info">
              <div className="la-course-2-author__header">
                <div className="la-course-2-author__logo">
                  <Image
                    src="/logo_academy.png"
                    alt="Landscape Academy"
                    width={73}
                    height={72}
                  />
                </div>
                <span className="la-course-2-author__label">АВТОР КУРСУ</span>
              </div>
              
              <h2 className="la-course-2-author__name">Анастасія Яковець</h2>
              
              <div className="la-course-2__author__description">
              <ul className="la-course-2__author__description">
                <li>Практикуючий ландшафтний дизайнер з 10+ роками досвіду </li>
                <li>Автор десятків реалізованих проєктів різного масштабу</li>
                <li>Наставник для колег-початківців у сфері 3D-проєктування</li>
                <li>Експерт у розробці робочих креслень та комунікації з замовниками </li>
              </ul>
              </div>
              
              <div className="la-course-2-author__buttons">
                <button className="la-course-2-author__button">ЗВ&apos;ЯЗАТИСЯ</button>
                <button className="la-course-2-author__button">ПРО КУРС</button>
              </div>
            </div>
          </div>
          
          <div className="la-course-2-author__photo">
            <Image
              src="/methods-author-photo.png"
              alt="Комар Микола"
              width={611}
              height={833}
              className="la-course-2-author__image"
            />
          </div>
        </div>
      </section>


      {/* Contact Questions Section */}
      <section ref={questionsRef} className={`la-course-2-contact-questions animate-fade-in-up ${questionsVisible ? 'is-visible' : ''}`}>
        <div className="la-course-2-contact-questions__inner">
          <div className="la-course-2-contact-questions__block"></div>
          <div className="la-course-2-contact-questions__content">
            <h2 className="la-course-2-contact-questions__text">ВІДПОВІМО ВАМ НА ВСІ ПИТАННЯ</h2>
            <div className="la-course-2-contact-questions__buttons">
              <button className="la-course-2-contact-questions__button">ЗАТЕЛЕФОНУЙТЕ НАМ</button>
              <button className="la-course-2-contact-questions__button">НАПИСАТИ В TELEGRAM</button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Program Section */}
      <section ref={programRef} className={`la-course-2-course-program animate-fade-in-up ${programVisible ? 'is-visible' : ''}`}>
        <div className="la-course-2-course-program__inner">
          <div className="la-course-2-course-program__header">
            <div className="la-course-2-course-program__left">
              <p className="la-course-2-course-program__motto">
              в чому секрет <br />виходу на високий <br />чек
              </p>
            </div>
            <div className="la-course-2-course-program__right">
              <h2 className="la-course-2-course-program__title">Що входить в курс</h2>
              <div className="la-course-2-course-program__schedule">
                <p className="la-course-2-course-program__schedule-text"></p>
                <p className="la-course-2-course-program__schedule-text"></p>
                <p className="la-course-2-course-program__schedule-text"></p>
              </div>
            </div>
          </div>
          
          <div className="la-course-2-course-program__line"></div>
          
          <div className="la-course-2-course-program__toggle">
            <h3 className="la-course-2-course-program__course-title">
            курс: Метод роботи практикуючого ландшафтного дизайнера
            </h3>
            <button 
              className="la-course-2-course-program__toggle-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label={isDropdownOpen ? 'Закрити програму' : 'Відкрити програму'}
            >
              <span className={isDropdownOpen ? 'la-course-2-course-program__toggle-icon open' : 'la-course-2-course-program__toggle-icon'}>
                <span></span>
              </span>
            </button>
          </div>
          
          {isDropdownOpen && (
            <>
              <div className="la-course-2-course-program__line"></div>
              
              <div className="la-course-2-course-program__content">
                <div className="la-course-2-course-program__module">
                  <div className="la-course-2-course-program__module-info">
                    <h4 className="la-course-2-course-program__module-number">5 відеоуроків</h4>
                    <h5 className="la-course-2-course-program__module-title">
                      Доступ у будь-який час з будь-якого пристрою — навчайтеся в зручному темпі. Робочі шаблони у PDF — всі необхідні документи готові до використання.
                    </h5>
                  </div>
                  
                  <div className="la-course-2-course-program__lessons">
                    <ul className="la-course-2-course-program__lesson-list">
                      <li className="la-course-2-course-program__lesson">
                        <p className="la-course-2-course-program__lesson-title">
                        Урок 1: Пошук клієнтів та перше спілкування 
                        </p>
                      </li>
                      
                      <li className="la-course-2-course-program__lesson">
                        <p className="la-course-2-course-program__lesson-title">
                        Урок 2: Перша зустріч на ділянці
                        </p>
                      </li>
                      
                      <li className="la-course-2-course-program__lesson">
                        <p className="la-course-2-course-program__lesson-title">
                        Урок 3: Комерційна пропозиція
                        </p>
                      </li>
                      <li className="la-course-2-course-program__lesson">
                        <p className="la-course-2-course-program__lesson-title">
                        Урок 4: Етапи проєктування
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="la-course-2-course-program__line"></div>
              
              <div className="la-course-2-course-program__content">
                <div className="la-course-2-course-program__module">
                  <div className="la-course-2-course-program__module-info">
                    <h4 className="la-course-2-course-program__module-number">Ви отримуєте шаблони, які працюють:
                    </h4>
                  </div>
                  
                  <div className="la-course-2-course-program__lessons">
                    <ul className="la-course-2-course-program__lesson-list">
                      <li className="la-course-2-course-program__lesson">
                        <p className="la-course-2-course-program__lesson-title">
                        Анкету клієнта для збору всієї необхідної інформації
                        </p>
                      </li>
                      
                      <li className="la-course-2-course-program__lesson">
                        <p className="la-course-2-course-program__lesson-title">
                        Комерційну пропозицію, яка обґрунтовує вашу ціну
                        </p>
                      </li>
                      
                      <li className="la-course-2-course-program__lesson">
                        <p className="la-course-2-course-program__lesson-title">
                        Договір на проєктування з актами затвердження етапів
                        </p>
                      </li>
                      <li className="la-course-2-course-program__lesson">
                        <p className="la-course-2-course-program__lesson-title">
                        Алгоритми презентації для гарантованого схвалення
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="la-course-2-course-program__line"></div>
              
              
              <div className="la-course-2-course-program__content">
                <h4 className="la-course-2-course-program__module-conclusion">
                Все готове до використання — просто підставляєте свої дані та починаєте працювати професійно вже завтра.
                </h4>
              </div>

            </>
          )}
        </div>
        <div className="la-course-2-course-program__line"></div>
      </section>

       {/* Order Section */}
       <section className="la-course-2-order">
         <div className="la-course-2-order__inner">
           <div className="la-course-2-order__content">
             <p className="la-course-2-order__text">
             Кожен день без системи — це втрачені гроші та репутація. Поки ви працюєте наосліп, ваші конкуренти використовують професійні методи та отримують високі чеки.
             </p>
             <p className="la-course-2-order__text">
             LANDSCAPER Academy — де практичний досвід перетворюється на робочі інструменти для вашого бізнесу.
             </p>
           </div>
           
           <div className="la-course-2-order__card">
             <h2 className="la-course-2-order__title">курс: Метод роботи практикуючого ландшафтного дизайнера</h2>
             <p className="la-course-2-order__start-date">СТАРТ 20.01.2025</p>
             
             <div className="la-course-2-order__pricing">
               <span className="la-course-2-order__old-price">2500 ГРН</span>
               <span className="la-course-2-order__new-price">1000 ГРН</span>
             </div>
             
             <button className="la-course-2-order__button">
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

export default Course2Page;