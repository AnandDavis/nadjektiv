import { TOPICS } from '@/content';
import { hashString, precacheUrls } from '@/lib/pwa/precache';
import { serviceWorkerSource } from '@/lib/pwa/service-worker-source';

/** The service worker, generated at build time from the route and content registry. */
export function GET() {
  const precache = precacheUrls();
  const version = hashString(
    `${process.env.VERCEL_GIT_COMMIT_SHA ?? 'local'}:${JSON.stringify(TOPICS)}:${precache.join()}`,
  );
  return new Response(serviceWorkerSource(version, precache), {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
