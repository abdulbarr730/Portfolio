/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*', // When the frontend calls /api/anything
        destination: 'https://portfolio-backend-omega-khaki.vercel.app//api/:path*', // Proxy to backend
      },
    ];
  },
};

module.exports = nextConfig;
