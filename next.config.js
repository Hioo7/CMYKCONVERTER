/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: []
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp']
  }
};

module.exports = nextConfig;