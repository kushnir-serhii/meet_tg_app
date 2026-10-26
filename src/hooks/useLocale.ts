'use client';

import { useSyncExternalStore } from 'react';

import { DEFAULT_LOCALE, type Locale, resolveLocale } from '@/i18n';
import { readStoredLocale, subscribeStoredLocale } from '@/lib/storedLocale';

import { useTelegram } from './useTelegram';

/**
 * Language picked in the ⋮ menu, else the Telegram user language, else the browser language.
 * Returns the default locale until the WebApp object is available (SSR + hydration).
 */
export const useLocale = (): Locale => {
  const webApp = useTelegram();
  const stored = useSyncExternalStore(subscribeStoredLocale, readStoredLocale, () => null);
  if (!webApp) return DEFAULT_LOCALE;
  return stored ?? resolveLocale(webApp.initDataUnsafe.user?.language_code ?? navigator.language);
};
