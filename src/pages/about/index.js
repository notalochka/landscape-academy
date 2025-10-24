import React from "react";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { pagesSEO, organizationSchema } from "../../config/seo";

const AboutPage = () => {
  const aboutSEO = pagesSEO.about;
  const [heroRef, heroVisible] = useScrollAnimation({ threshold: 0.1 });
  const [missionRef, missionVisible] = useScrollAnimation({ threshold: 0.1 });
  const [descriptionRef, descriptionVisible] = useScrollAnimation({ threshold: 0.1 });
  const [contactRef, contactVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <>
      <SEO
        title={aboutSEO.title}
        description={aboutSEO.description}
        keywords={aboutSEO.keywords}
        ogImage={aboutSEO.ogImage}
        canonical={aboutSEO.canonical}
        structuredData={organizationSchema}
      />

      {/* Header Section */}
      <Header showBanner={false} />

      {/* Hero Section */}
      <section ref={heroRef} className={`la-about-hero animate-fade-in-up ${heroVisible ? 'is-visible' : ''}`}>
        <div className="la-about-hero-inner">
            <h1 className="la-about-hero__title">ПРО</h1>
            <h1 className="la-about-hero__title">LANDSCAPER ACADEMY</h1>
        </div>
        <div className="la-about-hero__content">
          <div className="la-about-hero__left">
          
            <p className="la-about-hero__text">
              ОСВІТНЯ ПЛАТФОРМА, ЯКА ФОРМУЄ НОВЕ ПОКОЛІННЯ ЛАНДШАФТНИХ ДИЗАЙНЕРІВ, 
              НАВЧАЮЧИ ПРАЦЮВАТИ З УКРАЇНСЬКИМ КЛІМАТОМ, ГРУНТАМИ ТА РЕАЛЬНИМИ ПОТРЕБАМИ ЛЮДЕЙ.
            </p>
          </div>
          <div className="la-about-hero__right">
            <a href="/#programs-grid" className="la-about-hero__cta">
              Хочу вчитися в LANDSCAPER <br />ACADEMY
            </a>
          </div>
        </div>
      </section>

      {/* Mission and Values Section */}
      <section ref={missionRef} className={`la-about-mission animate-fade-in-up ${missionVisible ? 'is-visible' : ''}`}>
        <div className="la-about-mission__inner">
          <div className="la-about-mission__header">
            <div className="la-about-mission__logo">
              <img src="/logo_academy.png" alt="Landscaper Academy Logo" className="la-about-mission__logo-img" />
            </div>
            <h2 className="la-about-mission__title">МІСІЯ ТА ЦІННОСТІ</h2>
          </div>
          
          <div className="la-about-mission__list">
            <div className="la-about-mission__item">
              <span className="la-about-mission__bullet"></span>
              <p>працюють за сучасними стандартами, а не за радянськими схемами;</p>
            </div>
            <div className="la-about-mission__item">
              <span className="la-about-mission__bullet"></span>
              <p>розуміють не тільки рослини, а й потреби людей;</p>
            </div>
            <div className="la-about-mission__item">
              <span className="la-about-mission__bullet"></span>
              <p>можуть пояснити клієнту логіку своїх рішень;</p>
            </div>
            <div className="la-about-mission__item">
              <span className="la-about-mission__bullet"></span>
              <p>створюють простори, що поєднують красу, функціональність і прибутковість.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={descriptionRef} className={`la-about-description animate-fade-in-up ${descriptionVisible ? 'is-visible' : ''}`}>
        <div className="la-about-description__inner">
          <div className="la-about-description__content">
            <p className="la-about-description__text">
              <strong>LANDSCAPER Academy</strong> — це інвестиція в зелене майбутнє України.
            </p>
            <p className="la-about-description__text">
              Ми навчаємо ландшафтного дизайну українською мовою, з урахуванням клімату, 
              ґрунтів, флори та культурних традицій.
            </p>
            <p className="la-about-description__text">
              Наші курси практичні: не абстрактні схеми, а реальні кейси з досвіду роботи. 
              Програми структуровані й системні — замість випадкових порад із соцмереж.
            </p>
            <p className="la-about-description__text">
              Найцінніше — ми формуємо спільноту: дизайнерів, садівників і власників ділянок, 
              які обмінюються досвідом і знаходять партнерів по всій Україні.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="la-about-team">
        <div className="la-about-team__inner">
          <h2 className="la-about-team__title">КОМАНДА ЕКСПЕРТІВ</h2>
          
          <div className="la-about-team__cards">
            <div className="la-about-team__card">
              <div className="la-about-team__card-header">
                <img src="/author-photo.png" alt="Микола Комар" className="la-about-team__card-icon" />
              </div>
              <h3 className="la-about-team__card-name">Микола Комар</h3>
              <p className="la-about-team__card-role">
                магістр садово-паркового дизайну Луганського Національного Університету
              </p>
              <div className="la-about-team__card-image">
                <img src="/author-photo.png" alt="Микола Комар" className="la-about-team__card-photo" />
              </div>
              <p className="la-about-team__card-description">
                6 років глибокого вивчення ботаніки, грунтознавства, архітектури, планування територій. 
                Потім 15+ років роботи з проектами різного масштабу в різних кліматичних зонах.
              </p>
            </div>

            <div className="la-about-team__card">
              <div className="la-about-team__card-header">
                <img src="/ai-author-photo.png" alt="Катерина Комар" className="la-about-team__card-icon" />
              </div>
              <h3 className="la-about-team__card-name">Катерина Комар</h3>
              <p className="la-about-team__card-role">
                теж магістр садово-паркового дизайну, але пішла в маркетинг
              </p>
              <div className="la-about-team__card-image">
                <img src="/ai-author-photo.png" alt="Катерина Комар" className="la-about-team__card-photo" />
              </div>
              <p className="la-about-team__card-description">
                Працюючи з ландшафтною нішею, розумію і потреби клієнтів, і больові точки фахівців. 
                Знаю, як донести складні речі простою мовою та як структурувати навчальний контент.
              </p>
            </div>
          </div>

          <p className="la-about-team__conclusion">
            Разом ми — команда, яка може навчити не тільки садити рослини, а й заробляти на цьому. 
            Це унікальне поєднання для України.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="la-about-history">
        <div className="la-about-history__block">
          <div className="la-about-history__inner">
            <div className="la-about-history__logo">
              <img src="/logo_academy.png" alt="Landscaper Academy Logo" className="la-about-history__logo-img" />
            </div>
            <h2 className="la-about-history__title">Все почалося з розчарування.</h2>
            <div className="la-about-history__arrow"></div>
            <p className="la-about-history__text">
              Після 17 років роботи у ландшафтному дизайні Микола Комар щоразу стикався з однією проблемою — клієнти не розуміли логіку сучасного підходу.
            </p>
            <div className="la-about-history__quote-container">
              <div className="la-about-history__quote-bubble">
                <p className="la-about-history__quote-text">
                  «Проблема не в кліентах. Проблема в тому, що в Україні немає де навчитися робити це правильно», — сказав він одного вечора.
                </p>
              </div>
              <div className="la-about-history__quote-photo">
                <img src="/author-photo.png" alt="Микола Комар" className="la-about-history__quote-img" />
              </div>
            </div>
            <p className="la-about-history__text">
              В країні понад 40 мільйонів людей і мільйони власників ділянок, але більшість знань про ландшафт — це російськомовні відео, іноземні ресурси, не адаптовані до нашого клімату, або поради сусідів. Професійних дизайнерів — одиниці, а багато хто досі працює за радянськими схемами.
            </p>
            <div className="la-about-history__arrow"></div>
            <p className="la-about-history__text">
              У 2021 році під час мандрівок Україною ми побачили, що досвідчені практики мають унікальні знання, але немає платформи для їх передачі. Так з&apos;явилася ідея LANDSCAPER Academy — навчання від практиків для практиків.
            </p>
          </div>
          <div className="la-about-history__line"></div>
          <div className="la-about-history__inner">
            <h2 className="la-about-history__title">Війна стала точкою неповернення.</h2>
            <p className="la-about-history__text">
              Після 24 лютого 2022 року стало очевидно: Україна потребує фахівців, які допоможуть відбудовувати міста та села, роблячи їх зеленішими та стійкішими. Академія перетворилася з мрії на необхідність.
            </p>
            <div className="la-about-history__arrow"></div>
            <p className="la-about-history__text">
              Восени 2022 року ми вирішили відновити навчання в академії. І ми зібрали 2-й потік курсу LANDSCAPER. Ми зрозуміли - попит є.Людям потрібні не складні теорії, а прості пояснення того, як все працює насправді.
            </p>
          </div>
          <div className="la-about-history__line"></div>
          <div className="la-about-history__inner">
            <h2 className="la-about-history__title">Як працює наша академія ландшафтного дизайну</h2>
            <div className="la-about-history__arrow"></div>
            <p className="la-about-history__text">
            Сьогодні LANDSCAPER Academy — це втілення тієї самої ідеї про передачу практичних знань. Але ми пішли далі простих лекцій.
            <br />Наш підхід базується на практичності. Кожен курс ландшафтного дизайну створений на основі реального досвіду роботи з проєктами. Не абстрактні схеми з підручників, а кейси з поясненням помилок та успішних рішень.
            </p>
            <p className="la-about-history__text">
             І найголовніше — ми створюємо спільноту. Платформу, де ландшафтні дизайнери, садівники, власники ділянок і люди з зеленим серцем з різних регіонів України можуть обмінюватися досвідом, знаходити партнерів та підрядників.
            </p>
          </div>
          <div className="la-about-history__line"></div>
          <div className="la-about-history__inner">
            <h2 className="la-about-history__title">Результати, які надихають</h2>
            <div className="la-about-history__arrow"></div>
            <p className="la-about-history__text">
            Через рік після запуску наші студенти показують результати. Вони підвищують середній чек на 25-40%, отримують більше замовлень через краще розуміння потреб клієнтів, уникають типових помилок, які раніше коштували тисячі гривень.
            </p>
            <div className="la-about-history__student-quote-container">
              <div className="la-about-history__student-quote-photo">
                <img src="/avatar.png" alt="Учень LANDSCAPER Academy" className="la-about-history__student-quote-img" />
              </div>
              <div className="la-about-history__student-quote-bubble">
                <p className="la-about-history__student-quote-text">
                «Раніше я копіював чужі рішення, тепер створюю власні», — ділиться один із студентів.
                </p>
              </div>
            </div>
            <p className="la-about-history__text">
            Це саме те, заради чого все й почалося. Коли люди переходять від сліпого копіювання до усвідомленого творення. 
            </p>
          </div>
        </div>
      </section>

      {/* What's Next Section */}
      <section className="la-about-whats-next">
        <div className="la-about-whats-next__inner">
          <h2 className="la-about-whats-next__title">ЩО ДАЛІ...?</h2>
          
            <div className="la-about-whats-next__block-1">
              <p className="la-about-whats-next__block-text">
              Сьогодні LANDSCAPER Academy — це онлайн курси для початківців та професіоналів, офлайн зустрічі в різних містах України, спільнота з сотень фахівців, база підрядників та постачальників.
              </p>
            </div>
            
            <div className="la-about-whats-next__block-2">
              <p className="la-about-whats-next__block-text">
              А далі… Ми точно продовжуємо розвиток і роботу в напрямку створення ландшафтної культури України.
              </p>
            </div>
          
          <p className="la-about-whats-next__description">
            LANDSCAPER ACADEMY — ВІДКРИТА ДЛЯ ВСІХ, ХТО ПРАГНЕ ПРОФЕСІЙНОГО РОЗВИТКУ В ГАЛУЗІ ЛАНДШАФТНОГО ДИЗАЙНУ — ВІД ПОЧАТКІВЦІВ ДО ДОСВІДЧЕНИХ ФАХІВЦІВ, ЯКІ ХОЧУТЬ ОСУЧАСНИТИ СВОЇ ЗНАННЯ.
          </p>
          
          <h3 className="la-about-whats-next__cta">ДАЙТЕ СВОЇМ ІДЕЯМ ЗРОСТАТИ.</h3>
        </div>
      </section>

      {/* Contact Section */}
      <div ref={contactRef} className={`animate-fade-in-up ${contactVisible ? 'is-visible' : ''}`}>
        <Contact />
      </div>
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default AboutPage;
