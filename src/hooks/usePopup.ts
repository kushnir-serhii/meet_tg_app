'use client';

import { useCallback } from 'react';

import type { PopupParams } from '@/lib/telegram/webApp';

import { useTelegram } from './useTelegram';

/**
 * Native Telegram popup with custom buttons, as a promise of the pressed button id
 * (null when dismissed). Outside Telegram / on old clients falls back to `confirm`:
 * OK resolves to the first button whose id isn't 'cancel'.
 */
export const usePopup = () => {
  const webApp = useTelegram();

  return useCallback(
    (params: PopupParams): Promise<string | null> =>
      new Promise((resolve) => {
        if (webApp?.isVersionAtLeast('6.2')) {
          webApp.showPopup(params, (id) => {
            resolve(id || null);
          });
          return;
        }
        const ok = window.confirm(params.message);
        const action = params.buttons.find((button) => button.id !== 'cancel');
        resolve(ok ? (action?.id ?? null) : null);
      }),
    [webApp],
  );
};
