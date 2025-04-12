/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/feedbacks/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**", // ✅ ini untuk reward images
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/article/uploads/**", // ini penting
      },
      // Production domain
      {
        protocol: "https",
        hostname: "backend.lrt-sumsel.id",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "backend.lrt-sumsel.id",
        pathname: "/feedbacks/uploads/**",
      },
      {
        protocol: "https",
        hostname: "backend.lrt-sumsel.id",
        pathname: "/article/uploads/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
