import type { NextConfig } from 'next';

import { version } from './package.json';
import { securityHeaders } from './src/lib/security/headers';

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  async headers() {
    const headers = securityHeaders({
      dev: process.env.NODE_ENV === 'development',
      preview: process.env.VERCEL_ENV === 'preview',
    });
    return [{ source: '/:path*', headers }];
  },
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
