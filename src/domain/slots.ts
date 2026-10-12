import { fromZonedTime } from 'date-fns-tz';

import type { Poll } from './types';

type SlotConfig = Pick<Poll, 'dates' | 'hourFrom' | 'hourTo' | 'slotMinutes' | 'timezone'>;

const pad = (value: number): string => String(value).padStart(2, '0');

/** Minutes from midnight for each slot of a day, e.g. [540, 600, ...]. */
export const getDayMinuteOffsets = ({
  hourFrom,
  hourTo,
  slotMinutes,
}: Pick<SlotConfig, 'hourFrom' | 'hourTo' | 'slotMinutes'>): number[] => {
  const offsets: number[] = [];
  for (let minute = hourFrom * 60; minute < hourTo * 60; minute += slotMinutes) {
    offsets.push(minute);
  }
  return offsets;
};

/** Converts a local date + minute offset in `timezone` to a UTC ISO string. */
export const toSlotId = (date: string, minuteOffset: number, timezone: string): string => {
  const hours = pad(Math.floor(minuteOffset / 60));
  const minutes = pad(minuteOffset % 60);
  return fromZonedTime(`${date}T${hours}:${minutes}:00`, timezone).toISOString();
};

/** All slot ids of a poll, sorted chronologically. */
export const generateSlots = (config: SlotConfig): string[] => {
  const offsets = getDayMinuteOffsets(config);
  return config.dates.flatMap((date) =>
    offsets.map((offset) => toSlotId(date, offset, config.timezone)),
  );
};

export const normalizeSlotId = (value: string): string => new Date(value).toISOString();

/** Keeps only slots that belong to the poll, deduplicated and sorted. */
export const sanitizeSlots = (slots: string[], allowed: readonly string[]): string[] => {
  const allowedSet = new Set(allowed);
  const picked = new Set(slots.map(normalizeSlotId).filter((slot) => allowedSet.has(slot)));
  return allowed.filter((slot) => picked.has(slot));
};
