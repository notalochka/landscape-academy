import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const INSTAGRAM_URL = 'https://www.instagram.com/landscaper_academy';

const InstagramIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

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
          <Link href="/" className={`la-header__logo ${isMenuOpen ? 'la-header__logo--hidden' : ''}`} aria-label="Landscape Academy">
            <Image 
              src="/logo_academy.png" 
              alt="Landscape Academy"
              width={150}
              height={150}
              priority
              style={{ objectFit: 'contain' }}
            />
          </Link>
          
          {/* Desktop Menu — курси та блог ближче */}
          <nav className="la-header__menu la-header__menu--desktop" aria-label="Primary">
            <Link className={`la-header__link ${isActiveLink('/') ? 'la-header__link--active' : ''}`} href="/">ГОЛОВНА</Link>
            <Link className={`la-header__link ${isActiveLink('/courses') ? 'la-header__link--active' : ''}`} href="/courses">КУРСИ АКАДЕМІЇ</Link>
            <Link className={`la-header__link ${isActiveLink('/blog') ? 'la-header__link--active' : ''}`} href="/blog">БЛОГ</Link>
            <Link className={`la-header__link ${isActiveLink('/about') ? 'la-header__link--active' : ''}`} href="/about">ПРО АКАДЕМІЮ</Link>
            <Link className={`la-header__link ${isActiveLink('/flagship') ? 'la-header__link--active' : ''}`} href="/flagship">ФЛАГМАНСЬКИЙ КУРС</Link>
            <Link className={`la-header__link ${isActiveLink('/students') ? 'la-header__link--active' : ''}`} href="/students">НАШІ УЧНІ</Link>
            <Link className={`la-header__link ${isActiveLink('/contact') ? 'la-header__link--active' : ''}`} href="/contact">КОНТАКТИ</Link>
          </nav>

          {/* Desktop: Instagram + CTA */}
          <div className="la-header__right">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="la-header__social" aria-label="Instagram Landscape Academy">
              <InstagramIcon className="la-header__social-icon" />
            </a>
            <button className="la-header__cta la-header__cta--desktop" onClick={handleScrollToContact}>ЗАПИСАТИСЯ</button>
          </div>

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
          <Link className={`la-header__mobile-link ${isActiveLink('/courses') ? 'la-header__mobile-link--active' : ''}`} href="/courses" onClick={closeMenu}>КУРСИ АКАДЕМІЇ</Link>
          <Link className={`la-header__mobile-link ${isActiveLink('/blog') ? 'la-header__mobile-link--active' : ''}`} href="/blog" onClick={closeMenu}>БЛОГ</Link>
          <Link className={`la-header__mobile-link ${isActiveLink('/about') ? 'la-header__mobile-link--active' : ''}`} href="/about" onClick={closeMenu}>ПРО АКАДЕМІЮ</Link>
          <Link className={`la-header__mobile-link ${isActiveLink('/flagship') ? 'la-header__mobile-link--active' : ''}`} href="/flagship" onClick={closeMenu}>ФЛАГМАНСЬКИЙ КУРС</Link>
          <Link className={`la-header__mobile-link ${isActiveLink('/students') ? 'la-header__mobile-link--active' : ''}`} href="/students" onClick={closeMenu}>НАШІ УЧНІ</Link>
          <Link className={`la-header__mobile-link ${isActiveLink('/contact') ? 'la-header__mobile-link--active' : ''}`} href="/contact" onClick={closeMenu}>КОНТАКТИ</Link>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="la-header__mobile-social" onClick={closeMenu} aria-label="Instagram">
            <InstagramIcon className="la-header__social-icon" />
            <span>Instagram</span>
          </a>
        </nav>
      </div>
      
      {showBanner && (
        <div className="la-header__banner">
          <div className="la-header__banner-content">
            <div className="la-header__banner-image">
              <Image 
                src="/og-blog.jpg" 
                alt={bannerTitle}
                width={400}
                height={250}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
            </div>
            <h1 className="la-header__title">{bannerTitle}</h1>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
