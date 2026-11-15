
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Cloudflare R2 public bucket URLs
      { protocol: 'https', hostname: '**.r2.dev' },
      // Old images already uploaded to Cloudinary
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
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