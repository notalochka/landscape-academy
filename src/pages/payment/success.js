import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const PaymentSuccess = () => {
  const router = useRouter();
  const { orderRef, eventId } = router.query;
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (eventId && orderRef) {
      fetchEvent();
      sendNotification();
    }
  }, [eventId, orderRef]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      const result = await response.json();
      
      if (result.success) {
        setEvent(result.data);
      }
    } catch (error) {
      console.error('Помилка завантаження події:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendNotification = async () => {
    try {
      await fetch('/api/payment/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderReference: orderRef
        })
      });
    } catch (error) {
      console.error('Помилка відправки повідомлення:', error);
    }
  };

  const hasTelegramLink = event?.telegramLink && event.telegramLink.trim() !== '';

  return (
    <>
      <Head>
        <title>Оплата успішна - Landscape Academy</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '46px',
          padding: '80px 60px',
          maxWidth: '700px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)'
        }}>
          {isLoading ? (
            <p>Завантаження...</p>
          ) : (
            <>
              <div style={{
                width: '100px',
                height: '100px',
                background: '#000000',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 40px',
                animation: 'scaleIn 0.5s ease'
              }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>

              <h1 style={{
                fontFamily: '"Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                fontSize: '48px',
                fontWeight: '600',
                color: '#000',
                margin: '0 0 24px 0',
                textTransform: 'uppercase',
                lineHeight: '1.2'
              }}>
                Оплата успішна!
              </h1>

              <p style={{
                fontFamily: '"Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                fontSize: '20px',
                color: '#303030',
                margin: '0 0 16px 0',
                lineHeight: '1.4'
              }}>
                Дякуємо за реєстрацію на подію
              </p>
              
              <p style={{
                fontFamily: '"Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                fontSize: '24px',
                fontWeight: '600',
                color: '#000',
                margin: '0 0 48px 0'
              }}>
                {event?.title}
              </p>

              {hasTelegramLink ? (
                <>
                  <p style={{
                    fontFamily: '"Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                    fontSize: '18px',
                    color: '#303030',
                    margin: '0 0 32px 0',
                    fontWeight: '400'
                  }}>
                    Приєднуйтесь до Telegram групи події:
                  </p>
                  <a
                    href={event.telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '24px 80px',
                      background: '#303030',
                      color: '#fff',
                      borderRadius: '45px',
                      fontFamily: '"Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                      fontSize: '32px',
                      fontWeight: '400',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      transition: 'all 0.3s ease',
                      marginBottom: '32px',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#1a1a1a'}
                    onMouseOut={(e) => e.target.style.background = '#303030'}
                  >
                    Перейти до Telegram
                  </a>
                </>
              ) : (
                <p style={{
                  fontFamily: '"Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                  fontSize: '18px',
                  color: '#303030',
                  margin: '0 0 32px 0',
                  background: '#f5f5f5',
                  padding: '24px',
                  borderRadius: '20px',
                  lineHeight: '1.4'
                }}>
                  Наші менеджери зв&apos;яжуться з вами найближчим часом для уточнення деталей
                </p>
              )}

              <br />

              <Link href="/" style={{
                display: 'inline-block',
                padding: '18px 48px',
                background: '#E9E9E9',
                color: '#000',
                borderRadius: '45px',
                fontFamily: '"Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                fontSize: '20px',
                fontWeight: '400',
                textDecoration: 'none',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                border: '2px solid #000'
              }}
              onMouseOver={(e) => { e.target.style.background = '#000'; e.target.style.color = '#fff'; }}
              onMouseOut={(e) => { e.target.style.background = '#E9E9E9'; e.target.style.color = '#000'; }}
              >
                На головну
              </Link>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default PaymentSuccess;

