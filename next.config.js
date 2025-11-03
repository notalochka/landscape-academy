/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Оптимізація зображень (сумісна з Next.js 15)
  images: {
    // Дозволяємо оптимізацію зображень з різних доменів
    domains: ['landscaper.co.ua'],
    // Формати зображень для оптимізації
    formats: ['image/webp', 'image/avif'],
    // Розміри для responsive зображень
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Компресія
  compress: true,
  
  // Експериментальні функції для покращення продуктивності
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
}

module.exports = nextConfig
