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
  // Keep configuration simple for Vercel compatibility
  // We're not using assetPrefix, output, or distDir as they can cause issues with Vercel
};


module.exports = nextConfig;
