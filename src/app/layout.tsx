import type { Metadata, Viewport } from 'next';
import { ViewTransition } from 'react';
import { Archivo } from 'next/font/google';

import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration';
import { APP_CONFIG } from '@/config/app';
import { PREFERENCES_SCRIPT } from '@/lib/storage/preferences';

import './globals.css';

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  applicationName: APP_CONFIG.name,
  title: { default: APP_CONFIG.name, template: `%s · ${APP_CONFIG.name}` },
  description: APP_CONFIG.description,
  appleWebApp: { capable: true, title: APP_CONFIG.shortName, statusBarStyle: 'default' },
  formatDetection: { telephone: false },
  // The German is the lesson: a browser translating it would change the answers.
  other: { google: 'notranslate' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: APP_CONFIG.colors.headerLight },
    { media: '(prefers-color-scheme: dark)', color: APP_CONFIG.colors.headerDark },
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" translate="no" className={archivo.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFERENCES_SCRIPT }} />
        {/* Browsers fetch the manifest without cookies unless told otherwise. Sending them
            lets the request through Vercel's bot check, which the browser has already
            passed for the page itself; without it the app can't be installed. */}
        <link rel="manifest" href="/manifest.webmanifest" crossOrigin="use-credentials" />
      </head>
      <body className="min-h-dvh bg-canvas font-sans text-ink antialiased">
        {/* Navigations cross-fade (short, and off with reduced motion: globals.css). */}
        <ViewTransition>{children}</ViewTransition>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
