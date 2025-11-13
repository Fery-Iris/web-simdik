/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // ⚡ Optimasi Production Build
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Hapus console.log di production
  },
  swcMinify: true, // Minify dengan SWC (lebih cepat dari Terser)
  compress: true, // Enable gzip compression
  productionBrowserSourceMaps: false, // Disable source maps di production (hemat 30%)
  // Tree-shake icons untuk mengurangi bundle size
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'], // Tree-shake icons
  },
}

export default nextConfig
