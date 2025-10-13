import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const Custom404 = () => {
  return (
    <>
      <Head>
        <title>404 - Сторінка не знайдена | Landscape Academy</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Header />

      <div className="error-404">
        <div className="error-404__inner">
          {/* Велика цифра 404 */}
          <div className="error-404__number-block">
            <div className="error-404__number">404</div>
          </div>

          {/* Текстовий блок */}
          <div className="error-404__content">
            <h1 className="error-404__title">
              Сторінку не знайдено
            </h1>
            <p className="error-404__description">
              Схоже, ви заблукали в нашому саду знань. 
              Можливо, ця сторінка була пересаджена на нове місце 
              або взагалі не існувала.
            </p>

            {/* Кнопки навігації */}
            <div className="error-404__actions">
              <Link href="/" className="error-404__button error-404__button--primary">
                На головну
              </Link>
              <Link href="/blog" className="error-404__button error-404__button--secondary">
                До блогу
              </Link>
              <Link href="/courses" className="error-404__button error-404__button--secondary">
                Курси
              </Link>
            </div>

            {/* Декоративні елементи */}
            <div className="error-404__decoration">
              <div className="error-404__plant error-404__plant--1">🌿</div>
              <div className="error-404__plant error-404__plant--2">🍃</div>
              <div className="error-404__plant error-404__plant--3">🌱</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .error-404 {
          min-height: 80vh;
          background: #E9E9E9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          position: relative;
          overflow: hidden;
        }

        .error-404__inner {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .error-404__number-block {
          background: #000000;
          border-radius: 100px;
          padding: 80px 48px;
          text-align: center;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          margin-right: calc(50% - 50vw);
          box-sizing: border-box;
          margin-bottom: 60px;
          position: relative;
        }

        .error-404__number {
          font-family: "Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
          font-weight: 600;
          font-size: 180px;
          line-height: 1;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 20px;
          animation: glitch 2s infinite;
        }

        @keyframes glitch {
          0%, 100% {
            text-shadow: 
              2px 2px 0 #E9E9E9,
              -2px -2px 0 #E9E9E9;
          }
          25% {
            text-shadow: 
              -2px 2px 0 #E9E9E9,
              2px -2px 0 #E9E9E9;
          }
          50% {
            text-shadow: 
              2px -2px 0 #E9E9E9,
              -2px 2px 0 #E9E9E9;
          }
          75% {
            text-shadow: 
              -2px -2px 0 #E9E9E9,
              2px 2px 0 #E9E9E9;
          }
        }

        .error-404__content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .error-404__title {
          font-family: "Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
          font-weight: 600;
          font-size: 64px;
          line-height: 1.2;
          color: #000000;
          margin: 0 0 32px 0;
          text-transform: uppercase;
        }

        .error-404__description {
          font-family: "Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
          font-weight: 400;
          font-size: 24px;
          line-height: 1.4;
          color: #303030;
          margin: 0 0 64px 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .error-404__actions {
          display: flex;
          gap: 24px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 80px;
        }

        .error-404__button {
          padding: 20px 60px;
          border-radius: 45px;
          font-family: "Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
          font-weight: 400;
          font-size: 28px;
          line-height: 1.12;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          white-space: nowrap;
        }

        .error-404__button--primary {
          background: #303030;
          color: #ffffff;
          border: 2px solid #303030;
        }

        .error-404__button--primary:hover {
          background: #000000;
          border-color: #000000;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
        }

        .error-404__button--secondary {
          background: transparent;
          color: #000000;
          border: 2px solid #000000;
        }

        .error-404__button--secondary:hover {
          background: #000000;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .error-404__decoration {
          position: relative;
          height: 100px;
          margin-top: 40px;
        }

        .error-404__plant {
          position: absolute;
          font-size: 60px;
          animation: float 3s ease-in-out infinite;
          opacity: 0.6;
        }

        .error-404__plant--1 {
          left: 10%;
          top: 0;
          animation-delay: 0s;
        }

        .error-404__plant--2 {
          left: 50%;
          transform: translateX(-50%);
          top: 20px;
          animation-delay: 1s;
        }

        .error-404__plant--3 {
          right: 10%;
          top: 0;
          animation-delay: 2s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .error-404__number {
            font-size: 120px;
            letter-spacing: 10px;
          }

          .error-404__title {
            font-size: 48px;
          }

          .error-404__description {
            font-size: 20px;
          }

          .error-404__button {
            font-size: 24px;
            padding: 18px 48px;
          }
        }

        @media (max-width: 768px) {
          .error-404 {
            padding: 60px 20px;
          }

          .error-404__number-block {
            padding: 60px 24px;
            border-radius: 60px;
          }

          .error-404__number {
            font-size: 80px;
            letter-spacing: 5px;
          }

          .error-404__title {
            font-size: 36px;
          }

          .error-404__description {
            font-size: 18px;
            margin-bottom: 48px;
          }

          .error-404__button {
            font-size: 20px;
            padding: 16px 40px;
          }

          .error-404__actions {
            flex-direction: column;
            align-items: stretch;
          }

          .error-404__plant {
            font-size: 40px;
          }
        }
      `}</style>
    </>
  );
};

export default Custom404;

