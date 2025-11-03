import Script from 'next/script';

const ClarityAnalytics = () => {
  // Перевіряємо чи є Clarity ID
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  
  if (!clarityId || clarityId === 'your-clarity-id-here') {
    return null; // Не показуємо якщо ID не налаштований
  }

  return (
    <Script
      id="clarity-analytics"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `
      }}
    />
  );
};

export default ClarityAnalytics;
