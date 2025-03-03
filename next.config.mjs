/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skips ESLint during production build
  },
};


export default nextConfig;
