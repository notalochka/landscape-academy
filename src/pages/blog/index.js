import React, { useState } from "react";
import { blogPosts } from "../../data/blogs";
import SEO from "../../components/SEO/SEO";
import Header from "../../components/Header/Header";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";
import { pagesSEO } from "../../config/seo";

const BlogCard = ({ blog }) => {
  return (
    <article className="la-blog-card">
      <div className="la-blog-card__image">
        <div className="la-blog-card__placeholder"></div>
      </div>
      <div className="la-blog-card__content">
        <div className="la-blog-card__meta">
          <span className="la-blog-card__date">{blog.date}</span>
          <span className="la-blog-card__read-time">{blog.readTime}</span>
        </div>
        <div className="la-blog-card__category">[{blog.category}]</div>
        <h2 className="la-blog-card__title">{blog.title}</h2>
        <div className="la-blog-card__author">
          <div className="la-blog-card__author-avatar"></div>
          <span className="la-blog-card__author-name">{blog.author}</span>
        </div>
        <div className="la-blog-card__tags">
          {blog.tags.map((tag, index) => (
            <div key={index} className="la-blog-card__tag"></div>
          ))}
        </div>
      </div>
    </article>
  );
};

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const blogSEO = pagesSEO.blog;

  const filteredBlogs = blogPosts.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SEO
        title={blogSEO.title}
        description={blogSEO.description}
        keywords={blogSEO.keywords}
        ogImage={blogSEO.ogImage}
        canonical={blogSEO.canonical}
      />

      {/* Header Section */}
      <Header showBanner={true} bannerTitle="LANDSCAPER ACADEMY БЛОГ" />

      {/* Main Content */}
      <main className="la-blog-main">
        <div className="la-blog-main__inner">
          {/* Search Section */}
          <section className="la-blog-search">
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

          {/* Blog Grid */}
          <section className="la-blog-grid">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </section>
        </div>
      </main>

      {/* Contact Section */}
      <Contact />
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default BlogPage;
