import type { NextConfig } from 'next';

import { version } from './package.json';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Shown on the About page (see src/lib/app-version.ts).
  env: { APP_VERSION: version },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
