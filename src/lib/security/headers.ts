/**
 * HTTP security headers sent with every response (wired up in next.config.ts).
 *
 * The Content Security Policy keeps every page static: nonces would force each page
 * to render per request, which would end prerendering and the offline precache.
 * Without nonces, Next's inline bootstrap scripts (the React payload) need
 * 'unsafe-inline'. Everything else is locked to this origin, so even an injected
 * script could not load code from, or send data to, another site.
 */

/** Where the headers are being served from. */
export interface SecurityHeaderOptions {
  /** `next dev`: React needs eval for its error overlay and stack traces. */
  dev: boolean;
  /**
   * A Vercel preview deployment, where Vercel injects its comments toolbar. The hosts
   * are the ones Vercel documents for the toolbar.
   */
  preview: boolean;
}

export interface HttpHeader {
  key: string;
  value: string;
}

const TOOLBAR = 'https://vercel.live';

/** The Content-Security-Policy value, one directive per entry. */
export function contentSecurityPolicy({ dev, preview }: SecurityHeaderOptions): string {
  const extra = (...hosts: string[]) => (preview ? hosts : []);
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      ...(dev ? ["'unsafe-eval'"] : []),
      ...extra(TOOLBAR),
    ],
    // Inline style attributes carry animation delays and progress widths.
    'style-src': ["'self'", "'unsafe-inline'", ...extra(TOOLBAR)],
    'img-src': ["'self'", 'data:', 'blob:', ...extra(TOOLBAR, 'https://vercel.com')],
    'font-src': ["'self'", ...extra(TOOLBAR, 'https://assets.vercel.com')],
    // Analytics and Speed Insights report to /_vercel on this origin.
    'connect-src': ["'self'", ...extra(TOOLBAR, 'wss://ws-us3.pusher.com')],
    'frame-src': preview ? [TOOLBAR] : ["'none'"],
    'worker-src': ["'self'"],
    'manifest-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  };
  return Object.entries(directives)
    .map(([name, sources]) => `${name} ${sources.join(' ')}`)
    .join('; ');
}

/** Every security header, in the shape next.config's `headers()` expects. */
export function securityHeaders(options: SecurityHeaderOptions): HttpHeader[] {
  return [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy(options) },
    // Two years, the HSTS preload list's minimum. Not submitted to the list itself.
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    // frame-ancestors covers modern browsers; this covers older ones.
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    // The app uses none of these. Allow camera=(self) if QR transfer is built.
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
    },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  ];
}
