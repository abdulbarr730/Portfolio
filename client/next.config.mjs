
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // 👇 REPLACE THIS with your actual Backend Vercel URL
        destination: 'https://portfolio-backend-omega-khaki.vercel.app/api/:path*', 
      },
    ];
  },
};

// In .mjs files, we use 'export default' instead of 'module.exports'
export default nextConfig;