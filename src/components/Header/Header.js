import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const Header = ({ showBanner = false, bannerTitle = "LANDSCAPER ACADEMY" }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScrollToContact = () => {
    // Always scroll to contact form on current page
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Function to check if link is active
  const isActiveLink = (href) => {
    if (href === '/' && router.pathname === '/') return true;
    if (href !== '/' && router.pathname.startsWith(href)) return true;
    return false;
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
          
          {/* Desktop Menu */}
          <nav className="la-header__menu la-header__menu--desktop" aria-label="Primary">
            <Link className={`la-header__link ${isActiveLink('/') ? 'la-header__link--active' : ''}`} href="/">ГОЛОВНА</Link>
            <Link className={`la-header__link ${isActiveLink('/flagship') ? 'la-header__link--active' : ''}`} href="/flagship">ФЛАГМАНСЬКИЙ КУРС</Link>
            <Link className={`la-header__link ${isActiveLink('/about') ? 'la-header__link--active' : ''}`} href="/about">ПРО АКАДЕМІЮ</Link>
            <Link className={`la-header__link ${isActiveLink('/courses') ? 'la-header__link--active' : ''}`} href="/courses">КУРСИ АКАДЕМІЇ</Link>
            <Link className={`la-header__link ${isActiveLink('/students') ? 'la-header__link--active' : ''}`} href="/students">НАШІ УЧНІ</Link>
            <Link className={`la-header__link ${isActiveLink('/blog') ? 'la-header__link--active' : ''}`} href="/blog">БЛОГ</Link>
            <Link className={`la-header__link ${isActiveLink('/contact') ? 'la-header__link--active' : ''}`} href="/contact">КОНТАКТИ</Link>
          </nav>

          {/* Desktop CTA */}
          <button className="la-header__cta la-header__cta--desktop" onClick={handleScrollToContact}>ЗАПИСАТИСЯ</button>

          {/* Mobile Controls */}
          <div className="la-header__mobile-controls">
            <button 
              className="la-header__menu-toggle" 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className="la-header__hamburger"></span>
              <span className="la-header__hamburger"></span>
              <span className="la-header__hamburger"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`la-header__mobile-menu ${isMenuOpen ? 'la-header__mobile-menu--open' : ''}`}>
        <div className="la-header__mobile-menu-header">
          <div className="la-header__mobile-menu-logo">
            <Image 
              src="/logo_academy.png" 
              alt="Landscape Academy"
              width={40}
              height={40}
              style={{ objectFit: 'contain' }}
            />
            <span className="la-header__mobile-menu-label">МЕНЮ</span>
          </div>
          <div className="la-header__mobile-menu-controls">
            <button 
              className="la-header__close-btn" 
              onClick={closeMenu}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
        </div>
        
        <nav className="la-header__mobile-nav" aria-label="Mobile navigation">
          <Link className={`la-header__mobile-link ${isActiveLink('/') ? 'la-header__mobile-link--active' : ''}`} href="/" onClick={closeMenu}>ГОЛОВНА</Link>
          <Link className={`la-header__mobile-link ${isActiveLink('/flagship') ? 'la-header__mobile-link--active' : ''}`} href="/flagship" onClick={closeMenu}>ФЛАГМАНСЬКИЙ КУРС</Link>
          <Link className={`la-header__mobile-link ${isActiveLink('/about') ? 'la-header__mobile-link--active' : ''}`} href="/about" onClick={closeMenu}>ПРО АКАДЕМІЮ</Link>
          <Link className={`la-header__mobile-link ${isActiveLink('/courses') ? 'la-header__mobile-link--active' : ''}`} href="/courses" onClick={closeMenu}>КУРСИ АКАДЕМІЇ</Link>
          <Link className={`la-header__mobile-link ${isActiveLink('/students') ? 'la-header__mobile-link--active' : ''}`} href="/students" onClick={closeMenu}>НАШІ УЧНІ</Link>
          <Link className={`la-header__mobile-link ${isActiveLink('/blog') ? 'la-header__mobile-link--active' : ''}`} href="/blog" onClick={closeMenu}>БЛОГ</Link>
          <Link className={`la-header__mobile-link ${isActiveLink('/contact') ? 'la-header__mobile-link--active' : ''}`} href="/contact" onClick={closeMenu}>КОНТАКТИ</Link>
        </nav>
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
