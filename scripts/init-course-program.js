const db = require('../lib/database');

const initCourseProgram = () => {
  try {
    console.log('Ініціалізація програми курсу...');

    // Очищаємо існуючу програму для флагманського курсу (ID = 1)
    db.prepare('DELETE FROM course_program WHERE course_id = ?').run(1);

    // Додаємо програму флагманського курсу
    const insertProgram = db.prepare(`
      INSERT INTO course_program (
        course_id, module_number, module_title, module_description, lesson_number, 
        lesson_title, lesson_description, is_practical, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const program = [
      // Модуль 1
      { module: 1, title: "АНАЛІЗ СИТУАЦІЇ", lessons: [
        { number: 1, title: "Урок 1 - СИТУАЦІЯ НА РИНКУ", description: "( НАША РЕАЛЬНІСТЬ, ТРЕНДИ, ПРОБЛЕМИ ТА МОЖЛИВОСТІ)" },
        { number: 2, title: "Урок 2 - НАПРЯМКИ РОЗВИТКУ", description: "( ПЕРСПЕКТИВИ І НАПРЯМКИ В НІШІ ЛД)" },
        { number: 3, title: "Урок 3 - МАСШТАБ ОСОБИСТОСТІ", description: "( ШЛЯХИ ПРОФЕСІЙНОГО РОЗВИТКУ)" }
      ]},
      // Модуль 2
      { module: 2, title: "ЕКСПЕРТНІСТЬ", lessons: [
        { number: 1, title: "Урок 1 - Розпаковка експертності", description: "( пошук своїх сильних сторін)" },
        { number: 2, title: "Урок 2 - Фундамент експертності", description: "( аналіз наявних результатів)" },
        { number: 3, title: "Урок 3 - Кейси в ЛД", description: "( важливість збору кейсів)" },
        { number: 4, title: "Урок 4 - Школа бренду", description: "( як створите власний бренд)" }
      ]},
      // Модуль 3
      { module: 3, title: "САМОПРЕЗЕНТАЦІЯ", lessons: [
        { number: 1, title: "Урок 1 - Робота в групі з експертністю", description: "(практична робота)" },
        { number: 2, title: "Урок 2 - Продай себе за хвилину", description: "(практична робота)" },
        { number: 3, title: "Урок 3 - Пізнай свого клієнта", description: "(практична робота)" }
      ]},
      // Модуль 4
      { module: 4, title: "СОБІВАРТІСТЬ", lessons: [
        { number: 1, title: "Урок 1 - Рахуємо собівартість робочого дня", description: "(практична робота)" },
        { number: 2, title: "Урок 2 - Скидаєм баласт", description: "( Аналіз клієнтів)" },
        { number: 3, title: "Урок 3 - Оптимізація та ефективність", description: "(теоретичний урок)" }
      ]},
      // Модуль 5
      { module: 5, title: "ПІДВИЩЕННЯ ЦІНИ", lessons: [
        { number: 1, title: "Урок 1 - Коли піднімати ціни", description: "(теоретичний урок)" },
        { number: 2, title: "Урок 2 - Сервіс", description: "( Скрипт, Бріф, Договір, Збір даних, Портфоліо, Перше враження)" }
      ]},
      // Модуль 6
      { module: 6, title: "ПЛАН ЕФЕКТИВНОСТІ", lessons: [
        { number: 1, title: "Урок 1 - Обмежуючі переконання", description: "(теоретичний урок)" },
        { number: 2, title: "Урок 2 - Ставимо мету", description: "(практична робота)" },
        { number: 3, title: "Урок 3 - Плануємо дохід та чек", description: "(практична робота)" },
        { number: 4, title: "Урок 4 - Отримання навичок", description: "(теоретичний урок)" }
      ]},
      // Бонусні модулі
      { module: 7, title: "БУХГАЛТЕРІЯ В ЛД", lessons: [
        { number: 1, title: "Урок 1 - Основи бухгалтерії", description: "(Бухгалтерський облік для ландшафтних дизайнерів)" },
        { number: 2, title: "Урок 2 - Практична робота", description: "(Ведення бухгалтерського обліку)" }
      ]},
      { module: 8, title: "БУХГАЛТЕРІЯ В ЛД", lessons: [
        { number: 1, title: "Урок 1 - Податковий облік", description: "(Податковий облік для ландшафтних дизайнерів)" },
        { number: 2, title: "Урок 2 - Практична робота", description: "(Ведення податкового обліку)" }
      ]},
      { module: 9, title: "БУХГАЛТЕРІЯ В ЛД", lessons: [
        { number: 1, title: "Урок 1 - Звітність", description: "(Складання звітності для ландшафтних дизайнерів)" },
        { number: 2, title: "Урок 2 - Практична робота", description: "(Складання звітності)" }
      ]}
    ];

    let orderIndex = 0;

    program.forEach(module => {
      // Додаємо модуль
      insertProgram.run(
        1, // course_id
        module.module, // module_number
        `МОДУЛЬ ${module.module}`, // module_title (назва модуля)
        module.title, // module_description (опис модуля)
        null, // lesson_number
        null, // lesson_title
        null, // lesson_description
        0, // is_practical
        orderIndex++ // order_index
      );

      // Додаємо уроки модуля
      module.lessons.forEach(lesson => {
        insertProgram.run(
          1, // course_id
          module.module, // module_number
          `МОДУЛЬ ${module.module}`, // module_title (назва модуля)
          module.title, // module_description (опис модуля)
          lesson.number, // lesson_number
          lesson.title, // lesson_title
          lesson.description, // lesson_description
          lesson.practical ? 1 : 0, // is_practical
          orderIndex++ // order_index
        );
      });
    });

    console.log('Програма курсу успішно ініціалізована!');
  } catch (error) {
    console.error('Помилка ініціалізації програми курсу:', error);
  }
};

// Запускаємо ініціалізацію
initCourseProgram();
