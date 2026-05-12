/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repo = 'cold-calling-trainer';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // GitHub Pages serves the site at /<repo>/, so we need basePath + assetPrefix in production.
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  trailingSlash: true,
};

export default nextConfig;
