export const blogPosts = [
  {
    id: 1,
    title: "Як створити успішний ландшафтний дизайн-проект",
    category: "дизайн",
    date: "15 грудня 2024",
    readTime: "20 хвилин читання",
    author: "Олексій Петренко",
    authorAvatar: "/assets/avatars/author1.jpg",
    image: "/assets/blog/blog1.jpg",
    description: "Повний гід по створенню професійного ландшафтного дизайну від концепції до реалізації",
    tags: ["ландшафт", "дизайн", "проектування"]
  },
  {
    id: 2,
    title: "Маркетинг для ландшафтних дизайнерів: як знайти клієнтів",
    category: "маркетинг",
    date: "12 грудня 2024",
    readTime: "15 хвилин читання",
    author: "Марія Коваленко",
    authorAvatar: "/assets/avatars/author2.jpg",
    image: "/assets/blog/blog2.jpg",
    description: "Ефективні стратегії маркетингу для розвитку бізнесу в сфері ландшафтного дизайну",
    tags: ["маркетинг", "бізнес", "клієнти"]
  },
  {
    id: 3,
    title: "AI рендеринг в ландшафтному дизайні: майбутнє вже тут",
    category: "ai рендер",
    date: "10 грудня 2024",
    readTime: "25 хвилин читання",
    author: "Дмитро Сидоренко",
    authorAvatar: "/assets/avatars/author3.jpg",
    image: "/assets/blog/blog3.jpg",
    description: "Як штучний інтелект революціонізує процес створення візуалізацій ландшафтних проектів",
    tags: ["AI", "рендеринг", "технології"]
  }
];

export const getBlogById = (id) => {
  return blogPosts.find(blog => blog.id === id);
};

export const getFeaturedBlogs = () => {
  return blogPosts.slice(0, 3);
};
