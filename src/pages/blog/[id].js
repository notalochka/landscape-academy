import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import { blogPostSchema, enhanceKeywordsWithTag, breadcrumbSchema } from "../../config/seo";
import { siteMetadata } from "../../config/seo";

const BlogPost = ({ blog, error, relatedBlogs = [] }) => {
  const router = useRouter();

  // Якщо помилка або блог не знайдено, перенаправляємо
  if (error || !blog) {
    if (typeof window !== 'undefined') {
      router.push('/blog');
    }
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    });
  };

  // Форматуємо зображення для structured data
  const blogImage = blog.image 
    ? (blog.image.startsWith('http') ? blog.image : `${siteMetadata.siteUrl}${blog.image.startsWith('/') ? blog.image : `/${blog.image}`}`)
    : `${siteMetadata.siteUrl}/og-blog.jpg`;
  
  // Генеруємо покращені keywords з тегом
  const enhancedKeywords = enhanceKeywordsWithTag(blog.tag, 'ландшафтний дизайн, блог');
  
  // Створюємо structured data для блогу з тегом
  const blogStructuredData = blogPostSchema({
    title: blog.title,
    description: blog.content?.substring(0, 160) || blog.excerpt || '',
    image: blogImage,
    date: blog.createdAt || new Date().toISOString(),
    author: blog.author || 'Landscape Academy',
    slug: blog.id?.toString() || '',
    tag: blog.tag || null
  });
  
  // Breadcrumbs для кращої навігації
  const breadcrumbItems = [
    { name: "Головна", url: siteMetadata.siteUrl },
    { name: "Блог", url: `${siteMetadata.siteUrl}/blog` },
    ...(blog.tag ? [{ name: blog.tag, url: `${siteMetadata.siteUrl}/blog?tag=${encodeURIComponent(blog.tag)}` }] : []),
    { name: blog.title, url: `${siteMetadata.siteUrl}/blog/${blog.id}` }
  ];
  
  const breadcrumbStructuredData = breadcrumbSchema(breadcrumbItems);
  
  // Об'єднуємо всі structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Landscape Academy",
        "url": siteMetadata.siteUrl,
        "logo": `${siteMetadata.siteUrl}/logo_academy.png`
      },
      blogStructuredData,
      breadcrumbStructuredData
    ]
  };

  // Article meta для SEO з покращеними тегами
  const articleMeta = {
    publishedTime: blog.createdAt || new Date().toISOString(),
    modifiedTime: blog.updatedAt || blog.createdAt || new Date().toISOString(),
    author: blog.author || 'Landscape Academy',
    section: blog.tag || 'Ландшафтний дизайн',
    tags: blog.tag ? [blog.tag, `${blog.tag} ландшафтний дизайн`, `статті про ${blog.tag}`] : []
  };

  return (
    <>
      <SEO
        title={`${blog.title} - Landscape Academy Blog`}
        description={blog.content?.substring(0, 160) || blog.excerpt || ''}
        keywords={enhancedKeywords}
        ogImage={blog.image ? (blog.image.startsWith('http') ? blog.image : blog.image.startsWith('/') ? blog.image : `/${blog.image}`) : '/og-blog.jpg'}
        ogType="article"
        canonical={`/blog/${blog.id}`}
        article={articleMeta}
        structuredData={structuredData}
      />

      <Header showBanner={true} bannerTitle="BLOG" />

      <main className="la-blog-post">
        <div className="la-blog-post__inner">
          <article className="la-blog-post__article">
            {/* Breadcrumbs */}
            <nav className="la-blog-post__breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Головна</Link>
              <span> / </span>
              <Link href="/blog">Блог</Link>
              {blog.tag && (
                <>
                  <span> / </span>
                  <Link href={`/blog?tag=${encodeURIComponent(blog.tag)}`}>{blog.tag}</Link>
                </>
              )}
              <span> / </span>
              <span>{blog.title}</span>
            </nav>
            
            {/* Header */}
            <header className="la-blog-post__header">
              {blog.tag && (
                <Link href={`/blog?tag=${encodeURIComponent(blog.tag)}`} className="la-blog-post__category">
                  [{blog.tag}]
                </Link>
              )}
              <h1 className="la-blog-post__title">{blog.title}</h1>
              
              <div className="la-blog-post__meta">
                <div className="la-blog-post__author">
                  <div className="la-blog-post__author-avatar"></div>
                  <span className="la-blog-post__author-name">{blog.author}</span>
                </div>
                <div className="la-blog-post__info">
                  <span className="la-blog-post__date">{formatDate(blog.createdAt)}</span>
                  <span className="la-blog-post__dot">•</span>
                  <span className="la-blog-post__read-time">{blog.readTime}</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="la-blog-post__image">
              <img 
                src={blog.image || '/og-blog.jpg'} 
                alt={blog.title}
                onError={(e) => {
                  e.target.src = '/og-blog.jpg';
                }}
              />
            </div>

            {/* Content */}
            <div className="la-blog-post__content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {blog.content}
              </ReactMarkdown>
            </div>

            {/* Related Posts */}
            {relatedBlogs && relatedBlogs.length > 0 && (
              <section className="la-blog-post__related">
                <h2 className="la-blog-post__related-title">Пов&apos;язані статті</h2>
                <div className="la-blog-post__related-list">
                  {relatedBlogs.map((relatedBlog) => (
                    <Link 
                      key={relatedBlog.id} 
                      href={`/blog/${relatedBlog.id}`}
                      className="la-blog-post__related-item"
                    >
                      <div className="la-blog-post__related-image">
                        <img src={relatedBlog.image || '/og-blog.jpg'} alt={relatedBlog.title} />
                      </div>
                      <div className="la-blog-post__related-content">
                        {relatedBlog.tag && (
                          <span className="la-blog-post__related-tag">[{relatedBlog.tag}]</span>
                        )}
                        <h3 className="la-blog-post__related-title-item">{relatedBlog.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>
      </main>

      <Contact />
      <Footer />

      <style jsx global>{`
        .la-blog-post {
          background: #E9E9E9;
          padding: 60px 0;
        }

        .la-blog-post__inner {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .la-blog-post__article {
          background: #ffffff;
          border-radius: 20px;
          padding: 60px;
        }

        .la-blog-post__header {
          margin-bottom: 40px;
        }

        .la-blog-post__category {
          font-family: "Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
          font-size: 16px;
          font-weight: 600;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 16px;
        }

        .la-blog-post__title {
          font-family: "Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
          font-size: 48px;
          font-weight: 700;
          line-height: 1.2;
          color: #000;
          margin: 0 0 24px 0;
        }

        .la-blog-post__meta {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .la-blog-post__author {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .la-blog-post__author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #000;
        }

        .la-blog-post__author-name {
          font-family: "Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #000;
        }

        .la-blog-post__info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: "Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
          font-size: 14px;
          color: #666;
        }

        .la-blog-post__dot {
          color: #ccc;
        }

        .la-blog-post__image {
          width: 100%;
          height: 400px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 40px;
        }

        .la-blog-post__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .la-blog-post__content {
          font-family: "Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
          font-size: 18px;
          line-height: 1.8;
          color: #303030;
        }

        .la-blog-post__content h1 {
          font-size: 36px;
          font-weight: 700;
          margin: 40px 0 20px 0;
          color: #000;
        }

        .la-blog-post__content h2 {
          font-size: 28px;
          font-weight: 700;
          margin: 32px 0 16px 0;
          color: #000;
        }

        .la-blog-post__content h3 {
          font-size: 22px;
          font-weight: 700;
          margin: 24px 0 12px 0;
          color: #000;
        }

        .la-blog-post__content p {
          margin: 0 0 20px 0;
        }

        .la-blog-post__content ul,
        .la-blog-post__content ol {
          margin: 0 0 20px 0;
          padding-left: 24px;
        }

        .la-blog-post__content li {
          margin: 8px 0;
        }

        .la-blog-post__content strong {
          font-weight: 700;
          color: #000;
        }

        .la-blog-post__content em {
          font-style: italic;
        }

        .la-blog-post__content code {
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.9em;
        }

        .la-blog-post__content pre {
          background: #f5f5f5;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 20px 0;
        }

        .la-blog-post__content pre code {
          background: none;
          padding: 0;
        }

        .la-blog-post__content blockquote {
          border-left: 4px solid #000;
          padding-left: 20px;
          margin: 20px 0;
          font-style: italic;
          color: #666;
        }

        .la-blog-post__content a {
          color: #000;
          text-decoration: underline;
        }

        .la-blog-post__content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 20px 0;
        }

        .la-blog-post__related {
          margin-top: 60px;
          padding-top: 40px;
          border-top: 2px solid #e0e0e0;
        }

        .la-blog-post__related-title {
          font-family: "Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #000;
          margin-bottom: 30px;
        }

        .la-blog-post__related-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .la-blog-post__related-item {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          background: #f9f9f9;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .la-blog-post__related-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .la-blog-post__related-image {
          width: 100%;
          height: 180px;
          overflow: hidden;
        }

        .la-blog-post__related-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .la-blog-post__related-content {
          padding: 20px;
        }

        .la-blog-post__related-tag {
          font-family: "Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: #666;
          display: block;
          margin-bottom: 8px;
        }

        .la-blog-post__related-title-item {
          font-family: "Bender", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #000;
          margin: 0;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .la-blog-post__article {
            padding: 40px 24px;
          }

          .la-blog-post__title {
            font-size: 32px;
          }

          .la-blog-post__image {
            height: 250px;
          }

          .la-blog-post__content {
            font-size: 16px;
          }

          .la-blog-post__content h1 {
            font-size: 28px;
          }

          .la-blog-post__content h2 {
            font-size: 24px;
          }

          .la-blog-post__content h3 {
            font-size: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default BlogPost;

// Server-Side Rendering для SEO
export async function getServerSideProps(context) {
  const { id } = context.params;
  
  try {
    // Перевіряємо валідність ID
    if (!id || isNaN(parseInt(id))) {
      console.error(`[Blog ${id}] Invalid blog ID: ${id}`);
      return {
        notFound: true
      };
    }
    
    const blogId = parseInt(id);
    console.log(`[Blog ${blogId}] Fetching blog from database...`);
    
    // Використовуємо той самий підхід, що і в blog/index.js
    const db = require('../../lib/database');
    
    if (!db) {
      console.error(`[Blog ${blogId}] Database is null or undefined`);
      return {
        notFound: true
      };
    }
    
    // Отримуємо блог з бази даних (без фільтру published, щоб знайти будь-який блог)
    const blog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(blogId);
    
    if (!blog) {
      // Додаткова діагностика: перевіряємо, чи є взагалі блоги в базі
      try {
        const allBlogs = db.prepare('SELECT id, title, published FROM blogs ORDER BY id').all();
        console.error(`[Blog ${blogId}] Blog not found. Total blogs in DB: ${allBlogs.length}`);
        console.error(`[Blog ${blogId}] Available blog IDs:`, allBlogs.map(b => b.id));
        if (allBlogs.length > 0) {
          console.error(`[Blog ${blogId}] Sample blog:`, { id: allBlogs[0].id, title: allBlogs[0].title, published: allBlogs[0].published });
        }
      } catch (e) {
        console.error(`[Blog ${blogId}] Error checking available blogs:`, e);
      }
      return {
        notFound: true
      };
    }
    
    console.log(`[Blog ${blogId}] Blog found: "${blog.title}", published: ${blog.published}`);

    // Функція для підрахунку часу читання
    const calculateReadTime = (content) => {
      const wordsPerMinute = 200;
      const words = (content || '').trim().split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      return `${minutes} хв читання`;
    };

    // Отримуємо пов'язані блоги за тегом (якщо є тег)
    let relatedBlogs = [];
    if (blog.tag) {
      relatedBlogs = db.prepare(`
        SELECT id, title, image, tag, created_at, featured_image 
        FROM blogs 
        WHERE tag = ? AND id != ? AND published = 1 
        ORDER BY created_at DESC 
        LIMIT 3
      `).all(blog.tag, parseInt(id));
    }

    // Форматуємо блог для фронтенду
    const formattedBlog = {
      ...blog,
      readTime: calculateReadTime(blog.content || ''),
      isPublished: blog.published === 1,
      createdAt: blog.created_at,
      updatedAt: blog.updated_at,
      image: blog.featured_image || blog.image || null,
      tag: blog.tag || null
    };

    // Форматуємо пов'язані блоги
    const formattedRelatedBlogs = relatedBlogs.map(relatedBlog => ({
      ...relatedBlog,
      createdAt: relatedBlog.created_at,
      image: relatedBlog.featured_image || relatedBlog.image || null,
      tag: relatedBlog.tag || null
    }));

    return {
      props: {
        blog: formattedBlog,
        relatedBlogs: formattedRelatedBlogs
      }
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return {
      notFound: true
    };
  }
}

