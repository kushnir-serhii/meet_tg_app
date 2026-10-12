'use client';

import { useMemo } from 'react';

import { useTelegram } from './useTelegram';

export const useHaptics = () => {
  const webApp = useTelegram();

  return useMemo(
    () => ({
      selection: () => webApp?.HapticFeedback.selectionChanged(),
      success: () => webApp?.HapticFeedback.notificationOccurred('success'),
      error: () => webApp?.HapticFeedback.notificationOccurred('error'),
    }),
    [webApp],
  );
};
