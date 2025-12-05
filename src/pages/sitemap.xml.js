import { siteMetadata } from '../config/seo';

function generateSiteMap(blogs = [], courses = []) {
  const baseUrl = siteMetadata.siteUrl;
  const now = new Date().toISOString();
  
  // Статичні сторінки
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/courses', priority: '0.9', changefreq: 'weekly' },
    { url: '/flagship', priority: '0.9', changefreq: 'weekly' },
    { url: '/blog', priority: '0.8', changefreq: 'daily' },
    { url: '/students', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' }
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Додаємо статичні сторінки
  staticPages.forEach(page => {
    sitemap += `
     <url>
       <loc>${baseUrl}${page.url}</loc>
       <lastmod>${now}</lastmod>
       <changefreq>${page.changefreq}</changefreq>
       <priority>${page.priority}</priority>
     </url>`;
  });

  // Додаємо динамічні сторінки блогів
  blogs.forEach(blog => {
    const lastmod = blog.updated_at || blog.created_at || now;
    sitemap += `
     <url>
       <loc>${baseUrl}/blog/${blog.id}</loc>
       <lastmod>${lastmod}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>`;
  });

  // Додаємо динамічні сторінки курсів
  courses.forEach(course => {
    const lastmod = course.updated_at || course.created_at || now;
    sitemap += `
     <url>
       <loc>${baseUrl}/courses/${course.id}</loc>
       <lastmod>${lastmod}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>`;
  });

  sitemap += `
   </urlset>`;

  return sitemap;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  try {
    const db = require('../../lib/database');
    
    // Отримуємо опубліковані блоги
    const blogs = db.prepare(`
      SELECT id, created_at, updated_at 
      FROM blogs 
      WHERE published = 1 
      ORDER BY created_at DESC
    `).all();
    
    // Отримуємо активні курси
    const courses = db.prepare(`
      SELECT id, created_at, updated_at 
      FROM courses 
      WHERE is_active = 1 
      ORDER BY created_at DESC
    `).all();
    
    // Генеруємо sitemap з динамічними даними
    const sitemap = generateSiteMap(blogs, courses);

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Fallback до статичного sitemap
    const sitemap = generateSiteMap([], []);
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
    return {
      props: {},
    };
  }
}

export default SiteMap;
