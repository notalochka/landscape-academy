import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const Header = ({ showBanner = false, bannerTitle = "LANDSCAPER ACADEMY" }) => {
  const router = useRouter();

  const handleScrollToContact = () => {
    // Always scroll to contact form on current page
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="la-header">
      <div className="la-header__nav">
        <div className="la-header__nav-inner">
          <Link href="/" className="la-header__logo" aria-label="Landscape Academy">
            <Image 
              src="/logo_academy.png" 
              alt="Landscape Academy"
              width={150}
              height={150}
              priority
              style={{ objectFit: 'contain' }}
            />
          </Link>
          <nav className="la-header__menu" aria-label="Primary">
            <Link className="la-header__link" href="/">ГОЛОВНА</Link>
            <Link className="la-header__link" href="/flagship">ФЛАГМАНСЬКИЙ КУРС</Link>
            <Link className="la-header__link" href="/courses">КУРСИ АКАДЕМІЇ</Link>
            <Link className="la-header__link" href="/about">ПРО АКАДЕМІЮ</Link>
            <Link className="la-header__link" href="/blog">БЛОГ</Link>
            <Link className="la-header__link" href="/students">НАШІ УЧНІ</Link>
            <Link className="la-header__link" href="/contact">КОНТАКТИ</Link>
          </nav>
          <button className="la-header__cta" onClick={handleScrollToContact}>ЗАПИСАТИСЯ</button>
        </div>
      </div>
      
      {showBanner && (
        <div className="la-header__banner">
          <div className="la-header__banner-content">
            <div className="la-header__banner-placeholder"></div>
            <h1 className="la-header__title">{bannerTitle}</h1>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
