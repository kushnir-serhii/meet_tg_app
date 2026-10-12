'use client';

import { useEffect } from 'react';

import { useTelegram } from './useTelegram';

/** Tells Telegram the app is ready, expands it and disables swipe-to-close. */
export const useTelegramInit = (): void => {
  const webApp = useTelegram();

  useEffect(() => {
    webApp?.ready();
    webApp?.expand();
    // Dragging over the grid must not close the app.
    webApp?.disableVerticalSwipes?.();
  }, [webApp]);
};
