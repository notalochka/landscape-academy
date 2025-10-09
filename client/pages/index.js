import React from "react";
import Head from "next/head";
import Home from "../src/pages/Home";

export default function Index() {
  return (
    <>
      <Head>
        <title>Landscape Academy - Школа ландшафтного дизайну</title>
        <meta name="description" content="Навчайтесь ландшафтному дизайну в Landscape Academy. Професійні курси, практичні заняття та сертифікація." />
        <meta name="keywords" content="ландшафтний дизайн, курси, навчання, сад, парк, дизайн" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Landscape Academy - Школа ландшафтного дизайну" />
        <meta property="og:description" content="Навчайтесь ландшафтному дизайну в Landscape Academy. Професійні курси, практичні заняття та сертифікація." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Home />
    </>
  );
}
