/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
    taint: true,
  },
  // Add this critical configuration
  async rewrites() {
    return [
      {
        source: '/SaleByCash/:id',
        destination: '/SaleByCash/[id]',
      },
    ];
  },
};

export default nextConfig;