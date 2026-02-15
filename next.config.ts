import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
  },
  // Enable compiler optimizations  
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      '@react-three/fiber',
      '@react-three/drei',
      '@react-spring/three',
      'three',
      'lucide-react'
    ],
  },

  // Turbopack configuration (empty to suppress warning)
  turbopack: {},

  // Build optimization
  poweredByHeader: false,

  // Static generation optimization
  trailingSlash: true,
};

export default nextConfig;
