import type { MetadataRoute } from 'next';

import { BRAND_COLORS } from '@/lib/pwa/brand';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Grammatik Games',
    short_name: 'Grammatik',
    description: 'Learn German A1–A2 grammar through quick games.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: BRAND_COLORS.canvasLight,
    theme_color: BRAND_COLORS.brand,
    lang: 'en',
    categories: ['education', 'games'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
