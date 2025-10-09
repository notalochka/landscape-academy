import React from "react";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import { pagesSEO } from "../../config/seo";

const StudentsPage = () => {
  const studentsSEO = pagesSEO.students;

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
      <Contact />
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default StudentsPage;
