import './globals.css';

import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Pick to Meet',
  description: 'Find a meeting time that works for everyone, right in Telegram.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  // telegram-web-app.js sets --tg-viewport-* on <html> before hydration; the mismatch is expected.
  <html lang="en" suppressHydrationWarning>
    <body>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      {children}
    </body>
  </html>
);

export default RootLayout;
