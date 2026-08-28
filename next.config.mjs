/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/tine-app',
  assetPrefix: '/tine-app/',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
