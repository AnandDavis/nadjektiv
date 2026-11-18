/**
 * Every route the app can show, so the service worker can make them available offline.
 */

import { TOPICS } from '@/content';
import { availableModes } from '@/lib/game/session';

const STATIC_ROUTES = ['/', '/revise', '/progress', '/settings', '/about', '/play/review'];
const ASSETS = [
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
];

export function precacheUrls(): string[] {
  const topicRoutes = TOPICS.flatMap((topic) => [
    `/topics/${topic.id}`,
    ...availableModes(topic).map((mode) => `/play/${topic.id}/${mode}`),
  ]);
  return [...STATIC_ROUTES, ...topicRoutes, ...ASSETS];
}

/** Small stable hash so a content or route change rotates the page cache. */
export function hashString(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) hash = ((hash << 5) + hash + input.charCodeAt(i)) >>> 0;
  return hash.toString(36);
}
