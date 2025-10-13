import React from "react";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { pagesSEO } from "../../config/seo";

const StudentsPage = () => {
  const studentsSEO = pagesSEO.students;
  const [contactRef, contactVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <>
      <SEO
        title={studentsSEO.title}
        description={studentsSEO.description}
        keywords={studentsSEO.keywords}
        ogImage={studentsSEO.ogImage}
        canonical={studentsSEO.canonical}
      />

      {/* Header Section */}
      <Header showBanner={true} bannerTitle="НАШІ УЧНІ" />
      
      {/* Contact Section */}
      <div ref={contactRef} className={`animate-fade-in-up ${contactVisible ? 'is-visible' : ''}`}>
        <Contact />
      </div>
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default StudentsPage;
