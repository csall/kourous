import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
  },

  // Build optimization
  poweredByHeader: false,
  
  // Static generation optimization
  trailingSlash: false,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options', 
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },
};

export default nextConfig;
