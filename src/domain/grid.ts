import type { Locale } from '@/i18n';
import { formatGridDate, formatMinuteOfDay } from '@/shared/format';

import { getDayMinuteOffsets, toSlotId } from './slots';
import type { Poll } from './types';

export type GridDay = { date: string; weekday: string; day: string };

export type GridRow = {
  minute: number;
  label: string;
  /** Slot id per day column (same order as `days`). */
  slots: string[];
};

export type GridModel = { days: GridDay[]; rows: GridRow[] };

/** Builds a "days × time" grid shown in the poll timezone. */
export const buildGrid = (poll: Poll, locale: Locale): GridModel => ({
  days: poll.dates.map((date) => ({ date, ...formatGridDate(date, locale) })),
  rows: getDayMinuteOffsets(poll).map((minute) => ({
    minute,
    label: formatMinuteOfDay(minute),
    slots: poll.dates.map((date) => toSlotId(date, minute, poll.timezone)),
  })),
});
