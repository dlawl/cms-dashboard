/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const API_BASE = process.env.API_BASE_URL;
    if (!API_BASE) return [];
    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
