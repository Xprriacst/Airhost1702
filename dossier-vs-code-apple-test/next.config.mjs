/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  basePath: isProd ? '/polaris-project' : '',
  assetPrefix: isProd ? '/polaris-project/' : '',
  output: 'export',
};

export default nextConfig;
