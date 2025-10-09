import React from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";

const Hero = () => {
  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.2 });
  const [subtitleRef, subtitleVisible] = useScrollAnimation({ threshold: 0.2 });
  const [ctaRef, ctaVisible] = useScrollAnimation({ threshold: 0.2 });
  const [descRef, descVisible] = useScrollAnimation({ threshold: 0.2 });

  const handleScrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="la-hero" aria-label="Intro">
      <div className="la-hero__inner">
        <div className="la-hero__title-block">
          <div className="la-hero__content">
            <h1 
              ref={titleRef}
              className={`la-hero__title animate-fade-in-up ${titleVisible ? 'is-visible' : ''}`}
            >
              LANDSCAPER<br />ACADEMY
            </h1>
            <p 
              ref={subtitleRef}
              className={`la-hero__subtitle animate-fade-in-up animate-delay-200 ${subtitleVisible ? 'is-visible' : ''}`}
            >
              місце для тих, хто змінює ландшафт.
            </p>
          </div>
        </div>

        <div 
          ref={ctaRef}
          className={`la-hero__cta-wrap animate-scale-in animate-delay-300 ${ctaVisible ? 'is-visible' : ''}`}
        >
          <button className="la-hero__cta hover-lift" type="button" onClick={handleScrollToContact}>записатися</button>
        </div>

        <p 
          ref={descRef}
          className={`la-hero__description animate-fade-in animate-delay-400 ${descVisible ? 'is-visible' : ''}`}
        >
          Інноваційна онлайн платформа для об&apos;єднання експертів у галузі ландшафтного дизайну для створення
          освітньої спільноти та підтримки розвитку зелених територій у контексті відбудови України.
        </p>
      </div>
    </section>
  );
};

export default Hero;


