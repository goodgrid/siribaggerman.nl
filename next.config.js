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
    domains: ['goodgrid-strapi.sloppy.zone'],
  }
}