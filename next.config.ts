import type { NextConfig } from 'next';

const repoBase = '/demo-lookout-tea-shop';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: repoBase,
  assetPrefix: repoBase,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
