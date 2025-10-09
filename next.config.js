/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  generateEtags: false,
  poweredByHeader: false,
}

module.exports = nextConfig
