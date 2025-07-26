import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true, },
  serverExternalPackages: ['@prisma/client'],
  images: { 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
  onDemandEntries: { maxInactiveAge: 25 * 1000, pagesBufferLength: 2, },
  typescript: { ignoreBuildErrors: true, },
  output: 'standalone',
};

export default nextConfig;
