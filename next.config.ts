import { execSync } from 'node:child_process';

import type { NextConfig } from 'next';

import { version } from './package.json';

/** The commit being built: from the host when it says (Vercel, GitHub Actions), else git. */
function buildCommit(): string {
  const fromHost = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA;
  if (fromHost) return fromHost;
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Baked in at build time and shown on the About page (see src/lib/app-version.ts).
  env: {
    APP_VERSION: version,
    BUILD_COMMIT: buildCommit(),
    BUILD_TIME: new Date().toISOString(),
  },
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
