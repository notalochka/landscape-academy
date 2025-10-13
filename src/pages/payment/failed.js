import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const PaymentFailed = () => {
  const router = useRouter();
  const { orderRef, eventId, reason } = router.query;
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

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

  const getReasonText = (reasonCode) => {
    const reasons = {
      '1100': 'Недостатньо коштів на рахунку',
      '1101': 'Картка заблокована',
      '1102': 'Невірний CVV код',
      '1103': 'Картка прострочена',
      'unknown': 'Невідома помилка'
    };
    return reasons[reasonCode] || 'Оплата не пройшла';
  };

  return (
    <>
      <Head>
        <title>Оплата не вдалася - Landscape Academy</title>
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
                background: '#dc3545',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 40px',
                animation: 'scaleIn 0.5s ease'
              }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
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
                Оплата не вдалася
              </h1>

              <p style={{
                fontFamily: '"Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                fontSize: '20px',
                color: '#666',
                margin: '0 0 16px 0',
                lineHeight: '1.4'
              }}>
                {getReasonText(reason)}
              </p>
              
              {event && (
                <p style={{
                  fontFamily: '"Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                  fontSize: '18px',
                  color: '#303030',
                  margin: '0 0 48px 0'
                }}>
                  Подія: <strong>{event.title}</strong>
                </p>
              )}

              <p style={{
                fontFamily: '"Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                fontSize: '16px',
                color: '#666',
                margin: '0 0 32px 0',
                background: '#f5f5f5',
                padding: '24px',
                borderRadius: '20px',
                lineHeight: '1.4'
              }}>
                Спробуйте ще раз або зв&apos;яжіться з нами для допомоги
              </p>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => router.back()}
                  style={{
                    padding: '18px 48px',
                    background: '#303030',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '45px',
                    fontFamily: '"Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                    fontSize: '20px',
                    fontWeight: '400',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#1a1a1a'}
                  onMouseOut={(e) => e.target.style.background = '#303030'}
                >
                  Спробувати ще раз
                </button>

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
                  border: '2px solid #000',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => { e.target.style.background = '#000'; e.target.style.color = '#fff'; }}
                onMouseOut={(e) => { e.target.style.background = '#E9E9E9'; e.target.style.color = '#000'; }}
                >
                  На головну
                </Link>
              </div>
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

export default PaymentFailed;

