import { isLocale, type Locale } from '@/i18n';

const LOCALE_KEY = 'pik:locale';

const listeners = new Set<() => void>();

/** Language picked in the ⋮ menu, or null when the user never picked one. */
export const readStoredLocale = (): Locale | null => {
  try {
    const value = localStorage.getItem(LOCALE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
};

/** Remembers the picked language and notifies subscribers (the app switches to it). */
export const writeStoredLocale = (locale: Locale) => {
  try {
    localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    // Storage may be unavailable; the app still follows Telegram's language.
  }
  listeners.forEach((listener) => {
    listener();
  });
};

export const subscribeStoredLocale = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
