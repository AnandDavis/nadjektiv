import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Suspense } from 'react';

/**
 * Vercel Web Analytics and Speed Insights: cookie-free, anonymous page views, round
 * counts and Core Web Vitals. Only on the production deployment, so local builds and
 * tests send nothing. Described on the About page.
 */
export function SiteAnalytics() {
  if (process.env.VERCEL_ENV !== 'production') return null;
  return (
    // Both read the URL, which must not hold up prerendering.
    <Suspense fallback={null}>
      <Analytics />
      <SpeedInsights />
    </Suspense>
  );
}
