/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'leonardo.osnova.io',
      },
      {
        protocol: 'https',
        hostname: 'img2.akspic.ru',
      },
      {
        protocol: 'https',
        hostname: 'img1.akspic.ru',
      },
      {
        protocol: 'https',
        hostname: 'img3.akspic.ru',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
