import './globals.css';

import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Meet — спільний час',
  description: 'Знайдіть час для зустрічі, зручний усім, прямо в Telegram.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="uk">
    <body>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      {children}
    </body>
  </html>
);

export default RootLayout;
