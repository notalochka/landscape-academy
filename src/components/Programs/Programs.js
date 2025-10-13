import React from "react";
import Image from "next/image";
import { getFeaturedBlogs } from "../../data/blogs";
import useScrollAnimation from "../../hooks/useScrollAnimation";

const ProgramCard = ({ title, subtitle, delay = "" }) => {
  const [cardRef, cardVisible] = useScrollAnimation({ threshold: 0.2 });
  
  return (
    <div 
      ref={cardRef}
      className={`la-program__card hover-lift animate-fade-in-up ${delay} ${cardVisible ? 'is-visible' : ''}`}
    >
      <h3 className="la-program__title">{title}</h3>
      <p className="la-program__subtitle">{subtitle}</p>
      <div className="la-program__arrow" aria-hidden>
        <span />
      </div>
    </div>
  );
};

const BlogCard = ({ blog, isLarge = false, delay = "" }) => {
  const [cardRef, cardVisible] = useScrollAnimation({ threshold: 0.2 });
  
  return (
    <div 
      ref={cardRef}
      className={`la-blog__card ${isLarge ? 'la-blog__card--large' : ''} hover-lift animate-scale-in ${delay} ${cardVisible ? 'is-visible' : ''}`}
    >
      <div className="la-blog__content">
        <h3 className="la-blog__title">{blog.title}</h3>
        <div className="la-blog__footer">
          <span className="la-blog__date">{blog.date}</span>
          <span className="la-blog__description">[{blog.category}]</span>
        </div>
      </div>
    </div>
  );
};

const Programs = () => {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });
  const [libraryHeaderRef, libraryHeaderVisible] = useScrollAnimation({ threshold: 0.2 });
  const featuredBlogs = getFeaturedBlogs();

  return (
    <>
      <section className="la-programs" aria-label="Навчальні програми">
        <div className="la-programs__inner">
          <div 
            ref={headerRef}
            className={`la-programs__header animate-fade-in ${headerVisible ? 'is-visible' : ''}`}
          >
            <Image
              className="la-programs__logo"
              src="/logo_academy.png"
              alt="Landscape Academy"
              width={150}
              height={150}
              style={{ objectFit: 'contain' }}
            />
            <span className="la-programs__eyebrow">Навчальні програми</span>
          </div>

          <div className="la-programs__grid">
            <ProgramCard title="Landscaper 5.0" subtitle="Перетвори хобі у бізнес" delay="animate-delay-100" />
            <ProgramCard title="ШІ рендер на телефоні" subtitle="Від ескізу до WOW за 5 хвилин" delay="animate-delay-200" />
            <ProgramCard
              title="Метод роботи практикуючого ландшафтного дизайнера"
              subtitle="Або в чому секрет виходу на високий чек"
              delay="animate-delay-300"
            />
          </div>
        </div>
      </section>

      <section className="la-library" aria-label="Бібліотека корисних матеріалів">
        <div className="la-library__inner">
          <div 
            ref={libraryHeaderRef}
            className={`la-library__header animate-fade-in ${libraryHeaderVisible ? 'is-visible' : ''}`}
          >
            <Image
              className="la-library__logo"
              src="/logo_academy.png"
              alt="Landscape Academy"
              width={150}
              height={150}
              style={{ objectFit: 'contain' }}
            />
            <span className="la-library__eyebrow">БІБЛІОТЕКА КОРИСНИХ МАТЕРІАЛІВ</span>
          </div>

          <div className="la-library__grid">
            <BlogCard 
              blog={featuredBlogs[0]}
              isLarge={true}
              delay="animate-delay-100"
            />
            <BlogCard 
              blog={featuredBlogs[1]}
              delay="animate-delay-200"
            />
            <BlogCard 
              blog={featuredBlogs[2]}
              delay="animate-delay-300"
            />
          </div>

          <div className="la-library__navigation">
            <div className="la-library__arrow la-library__arrow--left">
              <span></span>
            </div>
            <div className="la-library__arrow la-library__arrow--right">
              <span></span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Programs;
