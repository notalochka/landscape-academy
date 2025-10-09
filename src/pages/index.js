import React from "react";
import SEO from "../components/SEO/SEO";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import Programs from "../components/Programs/Programs";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";
import { pagesSEO, organizationSchema, websiteSchema } from "../config/seo";

export default function Home() {
  const homeSEO = pagesSEO.home;
  
  // Combine structured data schemas
  const structuredData = [organizationSchema, websiteSchema];

  return (
    <>
      <SEO
        title={homeSEO.title}
        description={homeSEO.description}
        keywords={homeSEO.keywords}
        ogImage={homeSEO.ogImage}
        canonical={homeSEO.canonical}
        structuredData={structuredData}
      />
      <div>
        <Header />
        <Hero />
        <Programs />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
