/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
    taint: true,
  },
};

export default nextConfig;