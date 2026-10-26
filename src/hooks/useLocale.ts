'use client';

import { useSyncExternalStore } from 'react';

import { DEFAULT_LOCALE, isLocale, type Locale, resolveLocale } from '@/i18n';

import { useTelegram } from './useTelegram';

const LOCALE_KEY = 'pik:locale';

const readStoredLocale = (): Locale | null => {
  try {
    const value = localStorage.getItem(LOCALE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
};

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** Remembers the language picked in the ⋮ menu and switches the app to it. */
export const setStoredLocale = (locale: Locale) => {
  try {
    localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    // Storage may be unavailable; the app still follows Telegram's language.
  }
  listeners.forEach((listener) => {
    listener();
  });
};

/**
 * Language picked in the ⋮ menu, else the Telegram user language, else the browser language.
 * Returns the default locale until the WebApp object is available (SSR + hydration).
 */
export const useLocale = (): Locale => {
  const webApp = useTelegram();
  const stored = useSyncExternalStore(subscribe, readStoredLocale, () => null);
  if (!webApp) return DEFAULT_LOCALE;
  return stored ?? resolveLocale(webApp.initDataUnsafe.user?.language_code ?? navigator.language);
};
