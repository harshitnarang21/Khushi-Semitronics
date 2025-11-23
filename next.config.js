/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.mouser.com', 'media.mouser.com'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.mouser.com',
      },
      {
        protocol: 'https',
        hostname: 'media.mouser.com',
      },
    ],
  },
  swcMinify: true,
}

module.exports = nextConfig

