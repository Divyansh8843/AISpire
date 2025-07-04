import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ...other config
  images: {
    domains: ["media.licdn.com"],
  },
};
export default nextConfig;
