import React from "react";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { pagesSEO } from "../../config/seo";

const ContactPage = () => {
  const contactSEO = pagesSEO.contact;
  const [contactRef, contactVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <>
      <SEO
        title={contactSEO.title}
        description={contactSEO.description}
        keywords={contactSEO.keywords}
        ogImage={contactSEO.ogImage}
        canonical={contactSEO.canonical}
      />

      {/* Header Section */}
      <Header showBanner={false} />

      {/* Contact Section */}
      <div ref={contactRef} className={`animate-fade-in-up ${contactVisible ? 'is-visible' : ''}`}>
        <Contact />
      </div>
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default ContactPage;
