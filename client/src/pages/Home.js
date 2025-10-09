import React from "react";
import Menu from "../components/Menu/Menu";
import Hero from "../components/Hero/Hero";
import Programs from "../components/Programs/Programs";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";

const Home = () => {
  return (
    <div>
      <Menu />
      <Hero />
      <Programs />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
