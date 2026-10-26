import type { Locale as DateLocale } from 'date-fns';
import { enGB, uk as ukDate } from 'date-fns/locale';

import { en } from './locales/en';
import { uk } from './locales/uk';
import { DEFAULT_LOCALE, type Locale, LOCALES, type Messages } from './types';

export { DEFAULT_LOCALE, type Locale, LOCALES, type Messages };

const MESSAGES: Record<Locale, Messages> = { en, uk };
const DATE_LOCALES: Record<Locale, DateLocale> = { en: enGB, uk: ukDate };

/** Each language's name in itself, for the language picker. */
export const LOCALE_NAMES: Record<Locale, string> = { en: 'English', uk: 'Українська' };

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value);

/** Telegram `language_code` / browser language → supported locale ("uk-UA" → "uk"). */
export const resolveLocale = (code?: string | null): Locale => {
  const base = code?.toLowerCase().split('-')[0];
  return isLocale(base) ? base : DEFAULT_LOCALE;
};

export const getMessages = (locale: Locale): Messages => MESSAGES[locale];

export const getDateLocale = (locale: Locale): DateLocale => DATE_LOCALES[locale];
