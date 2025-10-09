import React from "react";

const Menu = () => {
  return (
    <header className="la-menu">
      <div className="la-menu__inner">
        <a href="/" className="la-menu__logo" aria-label="Landscape Academy">
          <img src="/logo_academy.png" alt="Landscape Academy" />
        </a>
        <nav className="la-menu__nav" aria-label="Primary">
          <a className="la-menu__link" href="/">Головна</a>
          <a className="la-menu__link" href="/flagship">Флагманський курс</a>
          <a className="la-menu__link" href="/courses">Курси академії</a>
          <a className="la-menu__link" href="/about">Про академію</a>
          <a className="la-menu__link" href="/blog">Блог</a>
          <a className="la-menu__link" href="/students">Наші учні</a>
        </nav>
        <a className="la-menu__cta" href="/apply">Записатися</a>
      </div>
    </header>
  );
};

export default Menu;





