import React from "react";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import { pagesSEO } from "../../config/seo";

const ContactPage = () => {
  const contactSEO = pagesSEO.contact;

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
      <Contact />
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default ContactPage;
