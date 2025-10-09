import React from "react";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import { pagesSEO, courseSchema } from "../../config/seo";

const FlagshipPage = () => {
  const flagshipSEO = pagesSEO.flagship;
  
  // Course structured data
  const flagshipCourseData = courseSchema({
    name: "Флагманський курс ландшафтного дизайну",
    description: "Комплексна програма навчання ландшафтному дизайну з професійними знаннями, практичними навичками та сертифікацією",
    price: "45000"
  });

  return (
    <>
      <SEO
        title={flagshipSEO.title}
        description={flagshipSEO.description}
        keywords={flagshipSEO.keywords}
        ogImage={flagshipSEO.ogImage}
        canonical={flagshipSEO.canonical}
        structuredData={flagshipCourseData}
      />

      {/* Header Section */}
      <Header showBanner={true} bannerTitle="ФЛАГМАНСЬКИЙ КУРС" />

      {/* Main Content */}
      <main className="la-flagship-main">
        <div className="la-flagship-main__inner">
          <section className="la-flagship-content">
            <h1 className="la-flagship-content__title">Флагманський курс ландшафтного дизайну</h1>
            <p className="la-flagship-content__description">
              Наш флагманський курс - це комплексна програма навчання, яка дасть вам всі необхідні 
              знання та навички для успішної роботи в сфері ландшафтного дизайну.
            </p>
            
            <div className="la-flagship-content__features">
              <div className="la-flagship-content__feature">
                <h3>Професійні знання</h3>
                <p>Отримайте глибокі знання в галузі ландшафтного дизайну від досвідчених викладачів.</p>
              </div>
              <div className="la-flagship-content__feature">
                <h3>Практичні навички</h3>
                <p>Розробляйте реальні проекти під керівництвом професіоналів.</p>
              </div>
              <div className="la-flagship-content__feature">
                <h3>Сертифікація</h3>
                <p>Отримайте сертифікат про закінчення курсу та станьте сертифікованим дизайнером.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Contact Section */}
      <Contact />
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default FlagshipPage;
