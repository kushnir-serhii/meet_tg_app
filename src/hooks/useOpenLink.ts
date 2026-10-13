'use client';

import { useCallback } from 'react';

import { useTelegram } from './useTelegram';

/** Opens an external link in the browser (Telegram's in-app WebView can't add to calendars). */
export const useOpenLink = () => {
  const webApp = useTelegram();

  return useCallback(
    (url: string) => {
      if (webApp) webApp.openLink(url);
      else window.open(url, '_blank', 'noopener');
    },
    [webApp],
  );
};
