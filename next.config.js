/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compress: false,
  basePath: "/dashboard",
  experimental: {
    outputStandalone: true
  }
}

module.exports = nextConfig
