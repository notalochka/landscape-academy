import React from "react";
import Image from "next/image";

const ProgramCard = ({ title, subtitle }) => {
  return (
    <div className="la-program__card">
      <h3 className="la-program__title">{title}</h3>
      <p className="la-program__subtitle">{subtitle}</p>
      <div className="la-program__arrow" aria-hidden>
        <span />
      </div>
    </div>
  );
};

const Programs = () => {
  return (
    <section className="la-programs" aria-label="Навчальні програми">
      <div className="la-programs__inner">
        <div className="la-programs__header">
          <Image
            className="la-programs__logo"
            src="/logo_academy.png"
            alt="Landscape Academy"
            width={150}
            height={50}
          />
          <span className="la-programs__eyebrow">Навчальні програми</span>
        </div>

        <div className="la-programs__grid">
          <ProgramCard title="Landscaper 5.0" subtitle="Перетвори хобі у бізнес" />
          <ProgramCard title="ШІ рендер на телефоні" subtitle="Від ескізу до WOW за 5 хвилин" />
          <ProgramCard
            title="Метод роботи практикуючого ландшафтного дизайнера"
            subtitle="Або в чому секрет виходу на високий чек"
          />
        </div>
      </div>
    </section>
  );
};

export default Programs;
