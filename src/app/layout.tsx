import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Inter } from 'next/font/google';

import { BRAND_COLORS } from '@/lib/pwa/brand';
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration';
import { PREFERENCES_SCRIPT } from '@/lib/storage/preferences';

import './globals.css';

const body = Inter({ variable: '--font-body', subsets: ['latin'], display: 'swap' });
const heading = Bricolage_Grotesque({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

const APP_NAME = 'Grammatik Games';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description:
    'Learn German A1–A2 grammar through quick games: sort, fill the gap, build sentences.',
  appleWebApp: { capable: true, title: APP_NAME, statusBarStyle: 'default' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: BRAND_COLORS.canvasLight },
    { media: '(prefers-color-scheme: dark)', color: BRAND_COLORS.canvasDark },
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${body.variable} ${heading.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFERENCES_SCRIPT }} />
      </head>
      <body className="min-h-dvh bg-canvas font-sans text-ink antialiased">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
