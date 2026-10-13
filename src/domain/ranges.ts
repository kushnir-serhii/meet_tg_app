import { formatInTimeZone } from 'date-fns-tz';

import type { RangeSummary, SlotRange, SlotSummary } from './types';

const addMinutes = (iso: string, minutes: number): string =>
  new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();

const sameIds = (a: SlotSummary['available'], b: SlotSummary['available']): boolean =>
  a.length === b.length && a.every((p, i) => p.userId === b[i]?.userId);

/** Merges consecutive slots (sorted UTC ISO) into continuous ranges. */
export const mergeSlotsIntoRanges = (slots: string[], slotMinutes: number): SlotRange[] => {
  const ranges: SlotRange[] = [];

  for (const slot of slots) {
    const last = ranges.at(-1);
    if (last?.end === slot) {
      last.end = addMinutes(slot, slotMinutes);
    } else {
      ranges.push({ start: slot, end: addMinutes(slot, slotMinutes) });
    }
  }

  return ranges;
};

/** Merges consecutive slot summaries that have exactly the same people available. */
export const mergeSummariesIntoRanges = (
  summaries: SlotSummary[],
  slotMinutes: number,
): RangeSummary[] => {
  const ranges: RangeSummary[] = [];

  for (const { slot, available, unavailable } of summaries) {
    const last = ranges.at(-1);
    if (last?.end === slot && sameIds(last.available, available)) {
      last.end = addMinutes(slot, slotMinutes);
    } else {
      ranges.push({ start: slot, end: addMinutes(slot, slotMinutes), available, unavailable });
    }
  }

  return ranges;
};

export type DayRanges<T extends SlotRange> = { date: string; ranges: T[] };

/** Groups ranges by their local date (`YYYY-MM-DD` in `timezone`), keeping every poll date. */
export const groupRangesByDay = <T extends SlotRange>(
  ranges: T[],
  dates: string[],
  timezone: string,
): DayRanges<T>[] =>
  dates.map((date) => ({
    date,
    ranges: ranges.filter(
      (range) => formatInTimeZone(range.start, timezone, 'yyyy-MM-dd') === date,
    ),
  }));
