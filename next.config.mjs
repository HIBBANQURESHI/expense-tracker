/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: false,
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skips ESLint during production build
  },
};


export default nextConfig;
