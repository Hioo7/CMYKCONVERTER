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
    serverComponentsExternalPackages: ['sharp', 'formidable']
  },
  // Ensure API routes work properly in deployment
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  // Ensure Sharp works properly on Vercel
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('sharp');
    }
    return config;
  },
};

module.exports = nextConfig;