import type { en } from './locales/en';

export const LOCALES = ['en', 'uk'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Every locale must provide the same keys as English. */
export type Messages = typeof en;
