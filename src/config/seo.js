// SEO Configuration for Landscape Academy

export const siteMetadata = {
  title: "Landscape Academy - Школа ландшафтного дизайну в Україні",
  description: "Навчайтесь ландшафтному дизайну українською мовою. Професійні курси, практичні заняття, сертифікація. Формуємо нове покоління ландшафтних дизайнерів.",
  siteUrl: "https://landscape-academy.com.ua",
  siteName: "Landscape Academy",
  locale: "uk_UA",
  type: "website",
  image: "/og-image.jpg", // Main OG image
  twitterHandle: "@landscape_academy",
  fbAppId: "",
  keywords: [
    "ландшафтний дизайн",
    "курси ландшафтного дизайну",
    "навчання ландшафту",
    "школа дизайну",
    "ландшафтна архітектура",
    "дизайн саду",
    "благоустрій території",
    "landscaper academy",
    "курси в україні",
    "онлайн навчання"
  ]
};

export const pagesSEO = {
  home: {
    title: "Landscape Academy - Школа ландшафтного дизайну в Україні",
    description: "Інноваційна онлайн платформа для навчання ландшафтному дизайну. Об'єднуємо експертів для створення освітньої спільноти та розвитку зелених територій України.",
    keywords: "ландшафтний дизайн курси, навчання ландшафту україна, школа ландшафтного дизайну, landscaper academy",
    ogImage: "/og-home.jpg",
    canonical: "/"
  },
  
  flagship: {
    title: "Флагманський курс ландшафтного дизайну - Landscape Academy",
    description: "Комплексна програма навчання ландшафтному дизайну. Отримайте всі необхідні знання та навички для успішної роботи в галузі. Професійні викладачі, практичні проекти.",
    keywords: "флагманський курс, професійне навчання, ландшафтний дизайн курс, сертифікація дизайнера",
    ogImage: "/og-flagship.jpg",
    canonical: "/flagship"
  },

  courses: {
    title: "Курси академії - Landscape Academy | Навчання ландшафтному дизайну",
    description: "Широкий спектр курсів ландшафтного дизайну для різних рівнів підготовки. Від початківців до професіоналів. Практичні знання та реальні проекти.",
    keywords: "курси ландшафту, landscaper 5.0, ai рендер, навчання дизайну онлайн",
    ogImage: "/og-courses.jpg",
    canonical: "/courses"
  },

  about: {
    title: "Про академію - Landscape Academy | Наша місія та цінності",
    description: "LANDSCAPER Academy — це інвестиція в зелене майбутнє України. Навчаємо ландшафтному дизайну українською мовою з урахуванням клімату, ґрунтів і традицій.",
    keywords: "про академію, місія landscaper academy, навчання українською, ландшафтна школа",
    ogImage: "/og-about.jpg",
    canonical: "/about"
  },

  blog: {
    title: "Блог Landscape Academy | Статті про ландшафтний дизайн",
    description: "Корисні статті, поради та новини з світу ландшафтного дизайну. Маркетинг, проектування, AI технології, тренди індустрії.",
    keywords: "блог ландшафтного дизайну, статті про дизайн, маркетинг для дизайнерів, ai в дизайні",
    ogImage: "/og-blog.jpg",
    canonical: "/blog"
  },

  students: {
    title: "Наші учні - Landscape Academy | Історії успіху",
    description: "Познайомтеся з талановитими учнями Landscape Academy та їх досягненнями в галузі ландшафтного дизайну. Реальні історії успіху.",
    keywords: "випускники landscape academy, учні дизайну, портфоліо студентів, історії успіху",
    ogImage: "/og-students.jpg",
    canonical: "/students"
  },

  contact: {
    title: "Контакти - Landscape Academy | Зв'яжіться з нами",
    description: "Зв'яжіться з Landscape Academy для отримання додаткової інформації про курси та навчальні програми. Телефон: +380956301304, Email: landscaperua@ukr.net",
    keywords: "контакти landscape academy, зв'язок з академією, записатися на курс",
    ogImage: "/og-contact.jpg",
    canonical: "/contact"
  }
};

// JSON-LD Structured Data
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Landscape Academy",
  "alternateName": "LANDSCAPER Academy",
  "url": "https://landscape-academy.com.ua",
  "logo": "https://landscape-academy.com.ua/logo_academy.png",
  "description": "Освітня платформа для навчання ландшафтному дизайну в Україні",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "UA",
    "addressLocality": "Україна"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+380956301304",
    "email": "landscaperua@ukr.net",
    "contactType": "customer service",
    "availableLanguage": "Ukrainian"
  },
  "sameAs": [
    "https://www.instagram.com/landscape_academy",
    "https://www.facebook.com/landscapeacademy"
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Landscape Academy",
  "url": "https://landscape-academy.com.ua",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://landscape-academy.com.ua/blog?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const courseSchema = (courseData) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "name": courseData.name,
  "description": courseData.description,
  "provider": {
    "@type": "Organization",
    "name": "Landscape Academy",
    "sameAs": "https://landscape-academy.com.ua"
  },
  "offers": courseData.price ? {
    "@type": "Offer",
    "price": courseData.price,
    "priceCurrency": "UAH"
  } : undefined
});

export const blogPostSchema = (postData) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": postData.title,
  "description": postData.description,
  "image": postData.image || `${siteMetadata.siteUrl}/og-blog.jpg`,
  "datePublished": postData.date,
  "author": {
    "@type": "Person",
    "name": postData.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "Landscape Academy",
    "logo": {
      "@type": "ImageObject",
      "url": "https://landscape-academy.com.ua/logo_academy.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `${siteMetadata.siteUrl}/blog/${postData.slug || ''}`
  }
});
