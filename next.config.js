/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Set to false to avoid double-initialization of Phaser
  webpack: (config) => {
    // Add specific handling for Phaser dependencies if needed
    return config;
  },
  // Optimize asset serving
  images: {
    unoptimized: true, // Don't optimize game assets
  },
  // Explicitly set asset prefix to be empty (default) to ensure asset paths work in all environments
  assetPrefix: '',
};

module.exports = nextConfig;
