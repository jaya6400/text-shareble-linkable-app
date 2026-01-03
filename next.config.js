/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Empty config acknowledges Turbopack usage
  },
  experimental: {
    turbo: {
      rules: {
        '*.wasm': {
          loaders: ['@vercel/turbopack-loader-wasm'],
          as: '*.wasm',
        },
      },
    },
  },
};

module.exports = nextConfig;