/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
    taint: true,
  },
  async headers() {
    return [
      {
        source: '/SaleByCash/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  generateBuildId: () => process.env.BUILD_ID || Date.now().toString(),
};

export default nextConfig;