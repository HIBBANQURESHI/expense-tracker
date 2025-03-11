/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add this configuration
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;