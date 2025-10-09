import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="la-footer">
      <div className="la-footer__inner">
        <div className="la-footer__section">
          <Link href="/" className="la-footer__logo-link">
            <Image
              className="la-footer__logo"
              src="/logo_academy.png"
              alt="Landscape Academy"
              width={150}
              height={150}
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </div>

        <div className="la-footer__section">
          <h3 className="la-footer__title">Зв&apos;язатися з нами</h3>
          <p className="la-footer__text">LANDSCAPER ACADEMY</p>
          <p className="la-footer__text">+380956301304</p>
        </div>

        <div className="la-footer__section">
          <h3 className="la-footer__title">Наші соц-мережі</h3>
          <a href="#" className="la-footer__link">INSTAGRAM</a>
        </div>

        <div className="la-footer__section">
          <h3 className="la-footer__title">Email</h3>
          <a href="mailto:landscaperua@ukr.net" className="la-footer__link">landscaperua@ukr.net</a>
        </div>
      </div>
      
      <div className="la-footer__bottom">
        <p className="la-footer__credit">
          <a 
            href="https://telebots.site/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="la-footer__credit-link"
          >
            TeleBots | Розробка сайтів
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
