/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compress: false,
  basePath: "/dashboard",
  experimental: {
    outputStandalone: true
  },
  serverRuntimeConfig: {
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  },
  publicRuntimeConfig: {
    MKL_API_SERVER_URL: process.env.MKL_API_SERVER_URL
  }
}

module.exports = nextConfig
