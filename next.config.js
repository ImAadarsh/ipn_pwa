const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\/workshop-detail\/.*\?_rsc=.*$/,
      handler: 'NetworkOnly',
      method: 'GET',
    },
    {
      urlPattern: /^https:\/\/.*\/workshop-detail\/.*$/,
      handler: 'NetworkFirst',
      method: 'GET',
    }
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: true,
    domains: ['app.ipnacademy.in'],
  },
};

module.exports = withPWA(nextConfig); 