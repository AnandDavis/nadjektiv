/**
 * Every route the app can show, so the service worker can make them available offline.
 */

import { TOPICS } from '@/content';
import { EXAM_LEVELS } from '@/lib/exam/exam';
import { availableModes } from '@/lib/game/session';

const STATIC_ROUTES = [
  '/',
  '/welcome',
  '/revise',
  '/progress',
  '/settings',
  '/about',
  '/glossary',
  '/verbs',
  '/records',
  '/play/review',
  '/play/daily',
  ...EXAM_LEVELS.map((level) => `/play/exam/${level.toLowerCase()}`),
];
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

// Rotates the page cache when content or routes change.
export { hashString } from '@/lib/utils/hash';
