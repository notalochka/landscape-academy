import React, { useState, useEffect } from "react";
import Image from "next/image";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { pagesSEO } from "../../config/seo";

const StudentsPage = () => {
  const studentsSEO = pagesSEO.students;
  const [contactRef, contactVisible] = useScrollAnimation({ threshold: 0.1 });
  const [currentStudent, setCurrentStudent] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  // Превентивне завантаження зображень
  useEffect(() => {
    const preloadImages = () => {
      const nextIndex = (currentStudent + 1) % students.length;
      const prevIndex = (currentStudent - 1 + students.length) % students.length;
      
      // Використовуємо window.Image для доступу до глобального конструктора
      const nextImg = new window.Image();
      const prevImg = new window.Image();
      
      nextImg.src = `/students-avatars/${students[nextIndex].avatar}`;
      prevImg.src = `/students-avatars/${students[prevIndex].avatar}`;
    };
    
    preloadImages();
  }, [currentStudent]);

  // Student data based on the available avatars
  const students = [
    {
      id: 1,
      name: "КСЕНІЯ",
      handle: "@KSUNIANIK_LANDSCAPING",
      location: "М.КИЇВ",
      services: "ДИЗАЙН, КВІТНИКИ, РЕНОВАЦІЯ САДІВ, РЕАЛІЗАЦІЯ",
      description1: "Упаковала свій профіль та портфоліо, зробила ребрендінг. Підвищила ціни та постійно зростає як експертка.",
      description2: "На курсі Ландскейпер 4,0 зробила якісне дослідження своїх сильних сторін та способів донесення їх клієнтам. Актуальне портфоліо та чіткий бріф допомагає і пришвидшує комунікацію з новими замовниками.",
      avatar: "1_ksunianik_landscaping.png"
    },
    {
      id: 2,
      name: "Юля Тихонова",
      handle: "@STEP_FLORA.UA",
      location: "м.Дніпро",
      services: "Викладачка курсів в школі Ландшафтного дизайну",
      description1: "Має 3 активних онлайн проекти про Ландшафтний дизайн та дослідження степової флори України. Навчає людей створювати сади.",
      description2: "Після проходження 1 потоку - зайнялась активною діяльністю в соцмережах. Де ділиться своїми знаннями, думками та результатими багаторічного дослідження рослин в совєїм саду з 'солоною' водою на рівні наукової ступені.",
      description3: "",
      avatar: "2_step_flora.ua.png"
    },
    {
      id: 3,
      name: "Ніна Калініна",
      handle: "@nina_kalinnaya",
      location: "м.Миколаїв",
      services: "Дизайн і реалізація садів ",
      description1: "Найдосвідченіший учасник курсу з багаторічним стажем і успішним бізнесом в Миколаєві та регіоні. Створила окремий канал продажу своїх послуг через соцмережі.",
      description2: "Маючи колосальний досвід і купу постійних клієнтів потрібно рости і адаптуватися до складної реальності. Упаковка профілю, скрипти продажу і демонстрація експертності стали новими напрямками для розвитку після проходження 3 потоку курсу.",
      description3: "",
      avatar: "3_nina_kalinnaya.png"
    },
    {
      id: 4,
      name: "Олена",
      handle: "@really_happy_gardener",
      location: "м.Полтава",
      services: "Блогерка про сад і дачу",
      description1: "Людина що знайшла себе і свій шлях.",
      description2: "Після курсу Ландскейпер зрозуміла, що професійний підхід не для неї. Обрала себе, свою дачу і роботу з рослинами.  Щаслива для себе людина. Іноді продає розсаду крутих сортів.",
      description3: "На курсі після розпаковки експертності і особистості знайшла головне - себе і свой шлях.",
      avatar: "4_really_happy_gardener.png"
    },
    {
      id: 5,
      name: "Євгенія Притула",
      handle: "@evgeniia_pritula",
      location: "м.Черкаси",
      services: "Догляд за садом. ТОпіарна стрижка рослин",
      description1: "З садівниці до Майстра та експерта своєї справи за рік.",
      description2: "Випускниця 4 потоку. Обрала для себе вузьку нішу і позиціювання ландшафтника-фрілансера. Працює в своєму ритмі і постійно вдосконалює свої навички. Переглянула скрипт спілкування і взаємодії з клієнтами, підвищила ціни майже в двічі. Тепер вона обирає клієнта а не навпаки.",
      description3: "",
      avatar: "5_evgeniia_pritula.png"
    },
    {
      id: 6,
      name: "Ірина",
      handle: "@gi.landscape",
      location: "м.Київ",
      services: "ЛАНДШАФТНИЙ ДИЗАЙНЕР | Проєктування | 3D візуалізація",
      description1: "Дизайнер без польової роботи. Саме такий шлях обрала Ірина для себе з огляду на свої сильні сторони. Після численних курсів з ЛД саме Ландскейпер дав необхідні комунікації для початку реальної роботи і заробітку.",
      description2: "Талановита Дизайнерка з високоякісними роботами. І швидким підходом до роботи.",
      description3: "",
      avatar: "6_gi.landscape.png"
    }, 
    {
      id: 7,
      name: "Ірина",
      handle: "@green_zone_kyiv",
      location: "м.Київ",
      services: "Доггляд за садом.",
      description1: "Збільшили ціни і потік клієнтів і стабілізували графік, щоб працювати без просадок в міжсезоння.",
      description2: "Працювали по сарафану але після проходження курсу зайнялися веденням соцмереж і покращенням сервісу, розширили спектр послуг.",
      description3: "",
      avatar: "7_green_zone_kyiv.png"
    },
    {
      id: 8,
      name: "Ірина",
      handle: "@ozelenennyadnipro",
      location: "м.Дніпро",
      services: "Дизайн та реалізація садів, виробництво садового декору для саду.",
      description1: "Після курсів по ЛД в м.Дніпро Анастасія з подругою взяли свій перший великий проект від ескізу до реалізації, і лише через рік потрапили на оффлайн захід Ланскеперів на тему Цінеутворення Осінь 2024, де ми і познайомилися. Через тиждень після зустрічі - вона написала, що вперше за рік змогла заробити на Ландшафті достойні гроші. І одразу забронювала місце на 4 потоці.",
      description2: "За цей рік вона змогла запустити виробництво садового декору для птахів та ентомофауни, Взяти ще кілька великих садів в дизайн і повністю перейшла на заробіток в ніші ЛД. На 5 потік вчитися піде вже її коліжанка. А разом ми розроблюємо проект на 0,3 га.",
      description3: "",
      avatar: "8_ozelenennyadnipro.png"
    },
    {
      id: 9,
      name: "Тетяна Загорулько",
      handle: "@zagorulko_gardens",
      location: "м.Колобжег - Польща",
      services: "",
      description1: "Виконавчий директор великої ландшафтно-будівельної компанії з розсадником. Дизайн, зелені дахи, промислові проекти, озеленення і будівництво доріг і прилеглої території, управління розсадником, логістика, менеджмент.",
      description2: "З першого потоку Тетяна здобула навички для самопрезентації та створення портфоліо в соціальних мережах. Що і допомогло переїхати з м.Кременчук до Польші і закріпитися на високій посаді. В процессі отримала ступінь Магістра з Садо-паркового господарства. ",
      description3: "Створює не просто сади а ціла паркові і рекреаційні зони, найбільший спроектований і реалізований сад 10 га. Щорічний спікер на курсі Ландскейпер.",
      avatar: "9_zagorulko_gardens.png"
    },
    {
      id: 10,
      name: "Сніжана Загной",
      handle: "@snezhanazagnoi86",
      location: "м.Дніпро",
      services: "Топіарне мистецтво, Ландшафтний дизайн, комплексний догляд.",
      description1: "Знайшла свій напрямок в ЛД. Переїхала з районного центру в велике місце з родиної де має постійне місце роботи. Знайшла себе в напрямку топіарного мистецтва. азом з Колегами стали надійними підрядниками і ми разом створили вже не один прекрасний сад.",
      description2: "На другий потік прийшла по рекомендації мого підрядника. Проаналізувавши всі свої навички все ж зосередилась на сильних сторонах. Вимушений переїзд з насидженого місця разом з родиною і кардинальна зміна професії не зламали цю чудову і світлу людину. Тепер в м.Дпіро є багато клумб біля коерційних обєктів, спортзалів, супермаркетів і т.п. не лише спроектованих Сніжаною а і втілених під її наглядом та за її участі.",
      description3: "",
      avatar: "10_snezhanazagnoi86.png"
    },
    {
      id: 11,
      name: "Юлія Костриця",
      handle: "@julia_landscape_fbuild",
      location: "м.Київ",
      services: "Ландшафтна дизайнерка в родинній компанії повного циклу ЛД послуг.",
      description1: "Вийшла з чоловіком на новий рівень доходу завдяки не лише приватним замовленням а й тендерам для бізнес об'єктів. Розширює спектр послуг та штат співробітників.",
      description2: "Ключевим рішенням було відмовитись від надання послуг з обслуговування на користь підрядникам, зосередившись на благоустрої та реалізації нових садів що і звільнило час для нових проектів.",
      description3: "Випускниця 3 потоку і наш Куратор. Відкинула ресурсоємні і маломаржинальні напрямки в ЛД. Зосередевши увагу на Кошторисах, логістиці та дизайні. Почала отримувати від роботи не лише дохід а і задоволення. Активно виїздить на ділянки в якості Технагляду.",
      avatar: "11_julia_landscape_fbuild.png"
    },
    {
      id: 12,
      name: "Юрій",
      handle: "@iurii.mikha",
      location: "м.Дніпро",
      services: "Хоббі - захист рослин, агрохімія",
      description1: "На курсі зрозумів що не готовий до пекреходу з основної роботи в царину ЛД. Тому вирішив залишити собі кілька постійних клієнтів в якості Хоббі. Спеціалізується на захисті рослин, агрохімії. Допомагає іншим учасникам з обробкою садів і контролю шкідників в садах.",
      description2: "Третій поток дав Юрію розуміння особливості професії, викликів та бажання займатися юлюбленою справою в своєму ритмі, без втрати часу на реорганізацію життя, доходів і побуту.",
      description3: "",
      avatar: "12_iurii.mikha.png"
    },
    {
      id: 13,
      name: "Неля Левченко",
      handle: "@levchenko_landscape",
      location: "м.Чернігів",
      services: "онлайн дизайн, скетчі, 3Д-візуалізація",
      description1: "Має стабільні замовлення на дизайн через інстаграм сторінку. Окрім клієнтів співпрацює з колегами роблячи віддалені і швидкі дизайн рішення. Амбасадор онлайн школи з ЛД.",
      description2: "Після кількох онлайн-курсів мала бажання займатися проектуванням але через брак досвіду та відсутність портфоліо і польової роботи не знаходила клієнтів.",
      description3: "На 3 потоці курсу упакувала свій профіль в соцмережі, отримала перші замовлення на дизайн від інших учасників, які були втіленні в життя. З отриманим досвідом і портфоліо активно працює в приємній для неї ніші.",
      avatar: "13_levchenko_landscape.png"
    },
    {
      id: 14,
      name: "Світлана Амірханян",
      handle: "@a.mirgarden",
      location: "м. Кривий Ріг",
      services: "Обслуговування і створення садів. Топіарна стрижка, має власний розсадник лаванди",
      description1: "Купила авто з першого продажу саджанців лаванди. Річний дохід 2 млн.",
      description2: "Була найманим працівником в розсаднику і пішла працювати на себе через відсутність перспективи росту. Брала всі види робіт і всіх клієнтів, дійшла до вигорання. Учасниця першого потоку і нині куратор курсу.",
      description3: "Після навчання переформувала структуру та команду. Відмовилась від клієнтів що заберали час при низькій маржинальності та від самостійної розробки дизайну, знайшовши партнерів-дизайнерів з 3 набору групи. Працює над собою і активно навчається",
      avatar: "14_a.mirgarden.png"
    },
    {
      id: 15,
      name: "Женя Єфімов",
      handle: "@sadovnik.vn",
      location: "м. Вінниця",
      services: "Обслуговування садів. Топіарна стрижка",
      description1: "Збільшив дохід після курсу х3. Відкрив новий напрям роботи",
      description2: "Мав досвід роботи в Ізраїлі але після повернення в Україну ніяк не міг вийти на стабільний заробіток. До Ландскейпер приєднався на 3 потоціі відбив вартість навчання 3 першого ж замовлення по обрізці плодового саду.",
      description3: "Пропрацював проблему самоцінності, експертності та позіціювіння на ринку.",
      avatar: "15_sadovnik.vn.png"
    }
  ];

  const nextStudent = () => {
    setImageLoading(true);
    setCurrentStudent((prev) => (prev + 1) % students.length);
  };

  const prevStudent = () => {
    setImageLoading(true);
    setCurrentStudent((prev) => (prev - 1 + students.length) % students.length);
  };

  return (
    <>
      <SEO
        title={studentsSEO.title}
        description={studentsSEO.description}
        keywords={studentsSEO.keywords}
        ogImage={studentsSEO.ogImage}
        canonical={studentsSEO.canonical}
      />

      {/* Header Section */}
      <Header showBanner={false}/>
      
      {/* Students Hero Section */}
      <section className="la-students-hero">
        <div className="la-students-hero__inner">
          <div className="la-students-hero__content">
            <h1 className="la-students-hero__title">НАШІ УЧНІ</h1>
            <p className="la-students-hero__description">
            Проект став прикладом того, як отримані знання можна швидко застосувати на практиці. Тепер ці фахівці впевнено працюють у сфері ландшафтного дизайну, реалізуючи власні ідеї та допомагаючи замовникам втілювати мрію про затишний простір.
            </p>
          </div>
        </div>
        </section>

        {/* Graduates Carousel Section */}
        <section className="la-graduates-carousel">
          <div className="la-graduates-carousel__inner">
            <h2 className="la-graduates-carousel__title">КЕЙСИ ВИПУСКНИКІВ</h2>
            
            <div className="la-graduates-carousel__card">
              <div className="la-graduates-carousel__content">
                <div className="la-graduates-carousel__image-container">
                  {imageLoading && (
                    <div className="la-graduates-carousel__image-placeholder">
                      <div className="la-graduates-carousel__image-skeleton">
                        Загрузка...
                      </div>
                    </div>
                  )}
                  <Image 
                    src={`/students-avatars/${students[currentStudent].avatar}`}
                    alt={students[currentStudent].name}
                    width={400}
                    height={400}
                    className={`la-graduates-carousel__image ${imageLoading ? 'loading' : 'loaded'}`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                    priority={currentStudent < 3}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
                
                <div className="la-graduates-carousel__info">
                  <div className="la-graduates-carousel__details">
                  <h3 className="la-graduates-carousel__name">{students[currentStudent].name}</h3>
                    <p className="la-graduates-carousel__handle">{students[currentStudent].handle}</p>
                    <p className="la-graduates-carousel__location">{students[currentStudent].location}</p>
                    <p className="la-graduates-carousel__services">{students[currentStudent].services}</p>
                  </div>
                  
                  <div className="la-graduates-carousel__description">
                    <p>{students[currentStudent].description1}</p>
                    <p>{students[currentStudent].description2}</p>
                    <p>{students[currentStudent].description3}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="la-graduates-carousel__navigation">
              <button 
                className="la-graduates-carousel__arrow la-graduates-carousel__arrow--left"
                onClick={prevStudent}
                aria-label="Попередній студент"
              >
                <div className="la-graduates-carousel__arrow-inner">
                  <span></span>
                </div>
              </button>
              <button 
                className="la-graduates-carousel__arrow la-graduates-carousel__arrow--right"
                onClick={nextStudent}
                aria-label="Наступний студент"
              >
                <div className="la-graduates-carousel__arrow-inner">
                  <span></span>
                </div>
              </button>
            </div>
          </div>
        </section>

        <section className="la-students-conclusion">
        <div className="la-students-conclusion__inner">
          <h2 className="la-students-conclusion__title">Стань автором власних <br /> ландшафтних проєктів</h2>
          <p className="la-students-conclusion__description">
          Наші випускники вже створюють зелені простори, що надихають: від затишних садів біля дому до масштабних сучасних парків. Кожен із них починав з нуля — без спеціальної освіти, але з бажанням навчитися.
          </p>
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

export default StudentsPage;
