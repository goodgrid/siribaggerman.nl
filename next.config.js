module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.net = false
      config.resolve.fallback.tls = false
    }
    return config
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'goodgrid-strapi.sloppy.zone',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'strapi-r5iq.onrender.com',
        pathname: '/uploads/**',
      },
    ],
  }
}