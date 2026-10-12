'use client';

import { DEFAULT_LOCALE, type Locale, resolveLocale } from '@/i18n';

import { useTelegram } from './useTelegram';

/**
 * Telegram user language, falling back to the browser language.
 * Returns the default locale until the WebApp object is available (SSR + hydration).
 */
export const useLocale = (): Locale => {
  const webApp = useTelegram();
  if (!webApp) return DEFAULT_LOCALE;
  return resolveLocale(webApp.initDataUnsafe.user?.language_code ?? navigator.language);
};
