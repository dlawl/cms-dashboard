import type { NextConfig } from "next";

const API_BASE = process.env.API_BASE_URL;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (!API_BASE) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
