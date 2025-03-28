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
    ],
  },
};

module.exports = nextConfig;
