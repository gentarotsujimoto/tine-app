import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/tine-app',
  assetPrefix: '/tine-app/',
  trailingSlash: true,
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@firebase/firestore': path.resolve(__dirname, 'node_modules/@firebase/firestore/dist/index.esm2017.js'),
      '@firebase/auth': path.resolve(__dirname, 'node_modules/@firebase/auth/dist/esm2017/index.js'),
    };
    return config;
  },
};

export default nextConfig;
