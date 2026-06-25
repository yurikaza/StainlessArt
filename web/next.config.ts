import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['iyzipay'],
  images: {
    remotePatterns: [
      // Trendyol CDN — real product images
      { protocol: 'https', hostname: '**.trendyol.com' },
      { protocol: 'https', hostname: '**.trendyolcdn.com' },
      // Unsplash — placeholder images in mock data
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
