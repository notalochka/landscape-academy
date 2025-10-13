import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";

const BlogPost = () => {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blog/${id}`);
      const result = await response.json();
      
      if (result.success) {
        setBlog(result.data);
      } else {
        router.push('/blog');
      }
    } catch (error) {
      console.error('Помилка завантаження блогу:', error);
      router.push('/blog');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <>
        <Header showBanner={true} bannerTitle="BLOG" />
        <main style={{ padding: '100px 20px', textAlign: 'center' }}>
          Завантаження...
        </main>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <>
      <SEO
        title={`${blog.title} - Landscape Academy Blog`}
        description={blog.content.substring(0, 160)}
        keywords={`${blog.tag}, ландшафтний дизайн, блог`}
        ogImage={blog.image}
      />

      <Header showBanner={true} bannerTitle="BLOG" />

      <main className="la-blog-post">
        <div className="la-blog-post__inner">
          <article className="la-blog-post__article">
            {/* Header */}
            <header className="la-blog-post__header">
              <div className="la-blog-post__category">[{blog.tag}]</div>
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
            {blog.image && (
              <div className="la-blog-post__image">
                <img src={blog.image} alt={blog.title} />
              </div>
            )}

            {/* Content */}
            <div className="la-blog-post__content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {blog.content}
              </ReactMarkdown>
            </div>
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

