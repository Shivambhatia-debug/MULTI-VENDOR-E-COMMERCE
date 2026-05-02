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
    const isProduction = process.env.NODE_ENV === 'production';
    const backendUrl = isProduction 
      ? '/_backend' 
      : 'http://127.0.0.1:8000';

    return [
      {
        source: '/api/python/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
};

export default nextConfig;
