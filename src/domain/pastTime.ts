import type { SlotRange } from './types';

/** True when the ISO instant `iso` is before `now`. */
export const isBefore = (iso: string, now: Date): boolean =>
  new Date(iso).getTime() < now.getTime();

/** True when the range has already ended — it can no longer be scheduled. */
export const hasEnded = (range: SlotRange, now: Date): boolean =>
  new Date(range.end).getTime() <= now.getTime();

/** True when the range starts before `now` — a meeting can't be scheduled in the past. */
export const startsInPast = (range: SlotRange, now: Date): boolean => isBefore(range.start, now);
