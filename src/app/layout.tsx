import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Inter } from 'next/font/google';

import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration';
import { APP_CONFIG } from '@/config/app';
import { PREFERENCES_SCRIPT } from '@/lib/storage/preferences';

import './globals.css';

const body = Inter({ variable: '--font-body', subsets: ['latin'], display: 'swap' });
const heading = Bricolage_Grotesque({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  applicationName: APP_CONFIG.name,
  title: { default: APP_CONFIG.name, template: `%s · ${APP_CONFIG.name}` },
  description: APP_CONFIG.description,
  appleWebApp: { capable: true, title: APP_CONFIG.shortName, statusBarStyle: 'default' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: APP_CONFIG.colors.canvasLight },
    { media: '(prefers-color-scheme: dark)', color: APP_CONFIG.colors.canvasDark },
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
