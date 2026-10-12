import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';

import type { Participant, SlotRange } from '@/domain/types';

const fmt = (iso: string, timezone: string, pattern: string): string =>
  formatInTimeZone(iso, timezone, pattern, { locale: uk });

/** "пн, 20.10" */
export const formatDay = (iso: string, timezone: string): string =>
  fmt(iso, timezone, 'EEEEEE, dd.MM');

/** "18:00" */
export const formatTime = (iso: string, timezone: string): string => fmt(iso, timezone, 'HH:mm');

/** "пн, 20.10 18:00" */
export const formatSlot = (iso: string, timezone: string): string =>
  `${formatDay(iso, timezone)} ${formatTime(iso, timezone)}`;

/** "пн, 20.10 18:00–20:00" */
export const formatRange = ({ start, end }: SlotRange, timezone: string): string =>
  `${formatSlot(start, timezone)}–${formatTime(end, timezone)}`;

/** Local `YYYY-MM-DD` → "пн, 20.10" */
export const formatDate = (date: string): string =>
  format(parseISO(date), 'EEEEEE, dd.MM', { locale: uk });

/** 570 → "09:30" */
export const formatMinuteOfDay = (minute: number): string =>
  `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;

export const formatNames = (participants: Participant[]): string =>
  participants.map((p) => p.name).join(', ');

/** Display name built from Telegram user fields. */
export const buildDisplayName = (firstName: string, lastName?: string): string =>
  [firstName, lastName].filter(Boolean).join(' ').trim();
