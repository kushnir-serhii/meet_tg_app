import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import type { Participant, SlotRange } from '@/domain/types';
import { getDateLocale, type Locale } from '@/i18n';

/** Short weekday: en "Tue", uk "вт" (default uk "EEE" gives "вів"). */
const WEEKDAY: Record<Locale, string> = { en: 'EEE', uk: 'EEEEEE' };

const fmt = (iso: string, timezone: string, pattern: string, locale: Locale): string =>
  formatInTimeZone(iso, timezone, pattern, { locale: getDateLocale(locale) });

/** en: "Mon 20 Oct" · uk: "пн 20 жовт." */
export const formatDay = (iso: string, timezone: string, locale: Locale): string =>
  fmt(iso, timezone, `${WEEKDAY[locale]} d MMM`, locale);

/** "18:00" */
export const formatTime = (iso: string, timezone: string): string =>
  formatInTimeZone(iso, timezone, 'HH:mm');

/** "Mon 20 Oct 18:00" */
export const formatSlot = (iso: string, timezone: string, locale: Locale): string =>
  `${formatDay(iso, timezone, locale)} ${formatTime(iso, timezone)}`;

/** "Mon 20 Oct 18:00–20:00" */
export const formatRange = ({ start, end }: SlotRange, timezone: string, locale: Locale): string =>
  `${formatSlot(start, timezone, locale)}–${formatTime(end, timezone)}`;

/** Local `YYYY-MM-DD` → { weekday: "Mon", day: "20.10" } (compact two-line grid header). */
export const formatGridDate = (date: string, locale: Locale): { weekday: string; day: string } => {
  const parsed = parseISO(date);
  const options = { locale: getDateLocale(locale) };
  return {
    weekday: format(parsed, WEEKDAY[locale], options),
    day: format(parsed, 'dd.MM', options),
  };
};

/** 570 → "09:30" */
export const formatMinuteOfDay = (minute: number): string =>
  `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;

export const formatNames = (participants: Participant[]): string =>
  participants.map((p) => p.name).join(', ');

/** Display name built from Telegram user fields. */
export const buildDisplayName = (firstName: string, lastName?: string): string =>
  [firstName, lastName].filter(Boolean).join(' ').trim();
