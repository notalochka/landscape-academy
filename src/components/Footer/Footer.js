import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="la-footer">
      <div className="la-footer__inner">
        <div className="la-footer__section">
          <Image
            className="la-footer__logo"
            src="/logo_academy.png"
            alt="Landscape Academy"
            width={150}
            height={50}
          />
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
    </footer>
  );
};

export default Footer;
