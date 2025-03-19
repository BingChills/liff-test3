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
  // Don't set assetPrefix as it can cause issues with relative paths
  // Handle trailing slashes to ensure consistent URL paths
  trailingSlash: false,
  // Ensure output is static-optimized
  output: 'standalone',
};

module.exports = nextConfig;
