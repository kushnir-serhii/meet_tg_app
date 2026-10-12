import type { SlotRange } from './types';

const addMinutes = (iso: string, minutes: number): string =>
  new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();

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
