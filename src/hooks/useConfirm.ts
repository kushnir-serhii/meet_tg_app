'use client';

import { useCallback } from 'react';

import { useTelegram } from './useTelegram';

/** Native Telegram confirm dialog as a promise (falls back to `window.confirm`). */
export const useConfirm = () => {
  const webApp = useTelegram();

  return useCallback(
    (message: string): Promise<boolean> =>
      new Promise((resolve) => {
        if (webApp) webApp.showConfirm(message, resolve);
        else resolve(window.confirm(message));
      }),
    [webApp],
  );
};
