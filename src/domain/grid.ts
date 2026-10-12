import { formatDate, formatMinuteOfDay } from '@/shared/format';

import { getDayMinuteOffsets, toSlotId } from './slots';
import type { Poll } from './types';

export type GridDay = { date: string; label: string };

export type GridRow = {
  minute: number;
  label: string;
  /** Slot id per day column (same order as `days`). */
  slots: string[];
};

export type GridModel = { days: GridDay[]; rows: GridRow[] };

/** Builds a "days × time" grid shown in the poll timezone. */
export const buildGrid = (poll: Poll): GridModel => ({
  days: poll.dates.map((date) => ({ date, label: formatDate(date) })),
  rows: getDayMinuteOffsets(poll).map((minute) => ({
    minute,
    label: formatMinuteOfDay(minute),
    slots: poll.dates.map((date) => toSlotId(date, minute, poll.timezone)),
  })),
});
