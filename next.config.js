const { i18n } = require('./next-i18next.config');

module.exports = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['images.ctfassets.net'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
};
