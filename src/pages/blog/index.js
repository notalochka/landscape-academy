import React, { useState, useEffect } from "react";
import Link from "next/link";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { pagesSEO, websiteSchema, organizationSchema, enhanceKeywordsWithTag } from "../../config/seo";

const BlogCard = ({ blog }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    });
  };

  // Визначаємо URL зображення
  const imageUrl = blog.image && blog.image.trim() ? blog.image : '/og-blog.jpg';
  
  return (
    <Link href={`/blog/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="la-blog-card">
        <div 
          className="la-blog-card__image" 
          style={{
            backgroundImage: `url('${imageUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'transparent'
          }}
        >
          <img 
            src={imageUrl} 
            alt={blog.title} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              display: 'block',
              minHeight: '200px',
              backgroundColor: 'transparent'
            }}
            onError={(e) => {
              // Ховаємо img, якщо не завантажиться, background покаже og-blog.jpg
              e.target.style.display = 'none';
            }}
          />
        </div>
        <div className="la-blog-card__content">
          <div className="la-blog-card__meta">
            <span className="la-blog-card__date">{formatDate(blog.createdAt)}</span>
            <span className="la-blog-card__read-time">{blog.readTime}</span>
          </div>
          {blog.tag && (
            <div className="la-blog-card__category">[{blog.tag}]</div>
          )}
          <h2 className="la-blog-card__title">{blog.title}</h2>
          <div className="la-blog-card__author">
            <div className="la-blog-card__author-avatar"></div>
            <span className="la-blog-card__author-name">{blog.author}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

const BlogPage = ({ initialBlogs = [], totalPages: initialTotalPages = 1 }) => {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const blogSEO = pagesSEO.blog;
  const [searchRef, searchVisible] = useScrollAnimation({ threshold: 0.1 });
  const [contactRef, contactVisible] = useScrollAnimation({ threshold: 0.1 });

  const blogsPerPage = 6;

  useEffect(() => {
    if (currentPage > 1) {
      fetchBlogs(currentPage);
    }
  }, [currentPage]);

  const fetchBlogs = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/blog?published=true&page=${page}&limit=${blogsPerPage}`);
      const result = await response.json();
      
      if (result.success) {
        setBlogs(result.data);
        setTotalPages(result.totalPages || 1);
      }
    } catch (error) {
      console.error('Помилка завантаження блогів:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Структуровані дані для SEO (використовуємо масив для кількох схем)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      websiteSchema,
      {
        "@type": "Blog",
        "name": "Landscape Academy Blog",
        "description": blogSEO.description,
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://landscaper.co.ua"}${blogSEO.canonical}`,
        "publisher": {
          "@type": "Organization",
          "name": "Landscape Academy",
          "logo": {
            "@type": "ImageObject",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://landscaper.co.ua"}/logo_academy.png`
          }
        }
      }
    ]
  };

  return (
    <>
      <SEO
        title={blogSEO.title}
        description={blogSEO.description}
        keywords={enhanceKeywordsWithTag(null, blogSEO.keywords)}
        ogImage={blogSEO.ogImage}
        canonical={blogSEO.canonical}
        structuredData={structuredData}
      />

      <Header showBanner={true} bannerTitle="LANDSCAPER ACADEMY БЛОГ" />

      <main className="la-blog-main">
        <div className="la-blog-main__inner">
          <section ref={searchRef} className={`la-blog-search animate-fade-in-up ${searchVisible ? 'is-visible' : ''}`}>
            <div className="la-blog-search__wrapper">
              <input
                type="text"
                placeholder="ПОШУК ПО БЛОГУ"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="la-blog-search__input"
              />
              <div className="la-blog-search__icon"></div>
            </div>
          </section>

          {isLoading && currentPage > 1 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Завантаження...
            </div>
          ) : (
            <>
              <section className="la-blog-grid">
                {filteredBlogs.length > 0 ? (
                  filteredBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#666', gridColumn: '1 / -1' }}>
                    Блоги не знайдено
                  </div>
                )}
              </section>

              {!searchTerm && totalPages > 1 && (
                <div className="la-blog-pagination">
                  <button
                    className="la-blog-pagination__button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Попередня
                  </button>
                  
                  <div className="la-blog-pagination__pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`la-blog-pagination__page ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    className="la-blog-pagination__button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Наступна →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <div ref={contactRef} className={`animate-fade-in-up ${contactVisible ? 'is-visible' : ''}`}>
        <Contact />
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;

// Server-Side Rendering для SEO
export async function getServerSideProps(context) {
  try {
    const db = require('../../lib/database');
    const blogsPerPage = 6;
    const page = parseInt(context.query.page) || 1;
    
    // Отримуємо опубліковані блоги
    const allBlogs = db.prepare(`
      SELECT * FROM blogs 
      WHERE published = 1 
      ORDER BY created_at DESC
    `).all();
    
    // Функція для підрахунку часу читання
    const calculateReadTime = (content) => {
      const wordsPerMinute = 200;
      const words = (content || '').trim().split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      return `${minutes} хв читання`;
    };
    
    // Форматуємо блоги
    const formattedBlogs = allBlogs.map(blog => {
      // Визначаємо зображення: спочатку featured_image, потім image, якщо немає - og-blog.jpg
      const image = blog.featured_image || blog.image || '/og-blog.jpg';
      
      return {
        ...blog,
        readTime: calculateReadTime(blog.content || ''),
        isPublished: blog.published === 1,
        createdAt: blog.created_at,
        image: image,
        tag: blog.tag || null
      };
    });
    
    // Пагінація
    const startIndex = (page - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    const paginatedBlogs = formattedBlogs.slice(startIndex, endIndex);
    const totalPages = Math.ceil(formattedBlogs.length / blogsPerPage);
    
    return {
      props: {
        initialBlogs: paginatedBlogs,
        totalPages: totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {
      props: {
        initialBlogs: [],
        totalPages: 1
      }
    };
  }
}
