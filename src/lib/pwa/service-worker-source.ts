/**
 * Source of the service worker served at /sw.js.
 *
 * Install: fetch every app route, then every /_next/static file (JS, CSS, fonts) those
 * pages reference, so the whole app works offline after one online visit, including
 * pages the learner has never opened.
 *
 * Fetch:
 * - /_next/static and icons: cache-first (file names are content-hashed, never stale).
 * - Page loads: network-first, falling back to the cached page, then to the home page.
 * - RSC requests (client-side navigation data): network-first, falling back to an exact
 *   cached match, else a plain 503. Never HTML and never a network error: a 503 makes
 *   Next.js fall back to a full page load, which the cached page then serves.
 *
 * Both caches are versioned per build; activating a new worker deletes the old ones.
 */
export function serviceWorkerSource(version: string, precache: readonly string[]): string {
  return `
const VERSION = ${JSON.stringify(version)};
const PAGES = 'pages-' + VERSION;
const STATIC = 'static-' + VERSION;
const PRECACHE = ${JSON.stringify(precache)};
const STATIC_REF = /\\/_next\\/static\\/[^"'\\\\\\s)<>]+/g;

async function precachePages() {
  const pages = await caches.open(PAGES);
  const assets = new Set();
  await Promise.allSettled(
    PRECACHE.map(async (url) => {
      const response = await fetch(new Request(url, { cache: 'reload' }));
      if (!response.ok) return;
      const type = response.headers.get('content-type') || '';
      if (type.includes('text/html')) {
        const html = await response.clone().text();
        for (const ref of html.match(STATIC_REF) || []) assets.add(ref);
      }
      await pages.put(url, response);
    }),
  );
  const statics = await caches.open(STATIC);
  await Promise.allSettled([...assets].map((url) => statics.add(new Request(url, { cache: 'reload' }))));
}

self.addEventListener('install', (event) => {
  event.waitUntil(precachePages().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== PAGES && k !== STATIC).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function isStatic(url) {
  return url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/');
}

function isRsc(request, url) {
  return request.headers.get('RSC') === '1' || url.searchParams.has('_rsc');
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(STATIC)).put(request, response.clone());
  return response;
}

// Offline with no exact cached payload: answer with a non-RSC 503 instead of a network
// error. Next.js treats that as "load this URL as a full page", which the page cache
// then serves. A rejected fetch can instead leave a soft navigation waiting.
function offlineRsc(request) {
  return async () =>
    (await caches.match(request)) ||
    new Response('', { status: 503, headers: { 'Content-Type': 'text/plain' } });
}

async function networkFirst(request, fallback) {
  try {
    const response = await fetch(request);
    if (response.ok) (await caches.open(PAGES)).put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await fallback();
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isStatic(url)) {
    event.respondWith(cacheFirst(request));
  } else if (isRsc(request, url)) {
    event.respondWith(networkFirst(request, offlineRsc(request)));
  } else if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request, async () =>
        (await caches.match(url.pathname, { ignoreVary: true })) ||
        (await caches.match('/', { ignoreVary: true })),
      ),
    );
  } else {
    event.respondWith(networkFirst(request, () => caches.match(request)));
  }
});
`;
}
