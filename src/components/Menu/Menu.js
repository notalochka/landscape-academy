import React from "react";
import Link from "next/link";
import Image from "next/image";

const Menu = () => {
  return (
    <header className="la-menu">
      <div className="la-menu__inner">
        <Link href="/" className="la-menu__logo" aria-label="Landscape Academy">
          <Image 
            src="/logo_academy.png" 
            alt="Landscape Academy"
            width={150}
            height={50}
            priority
          />
        </Link>
        <nav className="la-menu__nav" aria-label="Primary">
          <Link className="la-menu__link" href="/">Головна</Link>
          <Link className="la-menu__link" href="/flagship">Флагманський курс</Link>
          <Link className="la-menu__link" href="/courses">Курси академії</Link>
          <Link className="la-menu__link" href="/about">Про академію</Link>
          <Link className="la-menu__link" href="/blog">Блог</Link>
          <Link className="la-menu__link" href="/students">Наші учні</Link>
        </nav>
        <Link className="la-menu__cta" href="/apply">Записатися</Link>
      </div>
    </header>
  );
};

export default Menu;
