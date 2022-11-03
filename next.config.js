/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config, options) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    config.resolve.extensions = [
      ...config.resolve.extensions,
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      'css',
      'scss',
    ];
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  env: {
    ...require(`./config/${process.env.APP_ENV || 'local'}.json`),
  },
  images: {
    domains: ['www.gravatar.com'],
  },
};

module.exports = nextConfig;
