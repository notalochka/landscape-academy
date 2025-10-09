import React from "react";

const Hero = () => {
  return (
    <section className="la-hero" aria-label="Intro">
      <div className="la-hero__inner">
        <div className="la-hero__title-block">
          <div className="la-hero__content">
            <h1 className="la-hero__title">LANDSCAPER<br />ACADEMY</h1>
            <p className="la-hero__subtitle">місце для тих, хто змінює ландшафт.</p>
          </div>
        </div>

        <div className="la-hero__cta-wrap">
          <button className="la-hero__cta" type="button">записатися</button>
        </div>

        <p className="la-hero__description">
          Інноваційна онлайн платформа для об&apos;єднання експертів у галузі ландшафтного дизайну для створення
          освітньої спільноти та підтримки розвитку зелених територій у контексті відбудови України.
        </p>
      </div>
    </section>
  );
};

export default Hero;


