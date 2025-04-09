/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: false, // Set to false to avoid double-initialization of Phaser
   webpack: (config) => {
      // Add specific handling for Phaser dependencies if needed
      return config
   },
   // Configure image optimization
   images: {
      domains: ['placehold.co', 'api.qrserver.com', 'www.mcdonalds.com.sg', 's7d1.scene7.com', 'www.kfc.com.my'],
      formats: ['image/avif', 'image/webp'],
      minimumCacheTTL: 60
   }
   // Keep configuration simple for Vercel compatibility
   // We're not using assetPrefix, output, or distDir as they can cause issues with Vercel
}

module.exports = nextConfig

