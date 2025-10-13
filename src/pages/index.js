import React from "react";
import SEO from "../components/SEO/SEO";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import Programs from "../components/Programs/Programs";
import EventsCalendar from "../components/EventsCalendar/EventsCalendar";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";
import useScrollAnimation from "../hooks/useScrollAnimation";
import { pagesSEO, organizationSchema, websiteSchema } from "../config/seo";

export default function Home() {
  const homeSEO = pagesSEO.home;
  const [eventsRef, eventsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [programsRef, programsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [contactRef, contactVisible] = useScrollAnimation({ threshold: 0.1 });
  
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
        <div ref={eventsRef} className={`animate-fade-in-up ${eventsVisible ? 'is-visible' : ''}`}>
          <EventsCalendar />
        </div>
        <div ref={programsRef} className={`animate-fade-in-up ${programsVisible ? 'is-visible' : ''}`}>
          <Programs />
        </div>
        <div ref={contactRef} className={`animate-fade-in-up ${contactVisible ? 'is-visible' : ''}`}>
          <Contact />
        </div>
        <Footer />
      </div>
    </>
  );
}
