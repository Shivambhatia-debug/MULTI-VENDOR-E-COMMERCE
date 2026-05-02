import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/api/python/:path*',
        destination: process.env.NODE_ENV === 'development'
          ? 'http://localhost:8000/api/:path*'
          : '/_backend/api/:path*',
      },
    ];
  },
};

export default nextConfig;
