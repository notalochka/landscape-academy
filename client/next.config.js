/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  // Дозволяємо статичний експорт для деплою
  output: 'export',
  trailingSlash: true,
  // Відключаємо Image Optimization для статичного експорту
  assetPrefix: '',
  generateEtags: false,
  poweredByHeader: false,
}

module.exports = nextConfig
