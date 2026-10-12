import { describe, expect, it } from 'vitest';

import { computeResults } from './results';
import { generateSlots } from './slots';
import type { PollResponse } from './types';

const slots = generateSlots({
  dates: ['2026-10-20'],
  hourFrom: 18,
  hourTo: 21,
  slotMinutes: 60,
  timezone: 'Europe/Warsaw',
});

const response = (userId: number, name: string, picked: string[]): PollResponse => ({
  userId,
  name,
  username: null,
  slots: picked,
  updatedAt: '2026-10-12T00:00:00.000Z',
});

describe('generateSlots', () => {
  it('converts local poll hours to UTC', () => {
    expect(slots).toEqual([
      '2026-10-20T16:00:00.000Z',
      '2026-10-20T17:00:00.000Z',
      '2026-10-20T18:00:00.000Z',
    ]);
  });
});

describe('computeResults', () => {
  it('merges slots where everyone is free into ranges', () => {
    const results = computeResults(
      slots,
      [response(1, 'Olena', slots), response(2, 'Andrii', slots.slice(0, 2))],
      60,
    );

    expect(results.perfectRanges).toEqual([
      { start: '2026-10-20T16:00:00.000Z', end: '2026-10-20T18:00:00.000Z' },
    ]);
  });

  it('returns best slots with names of those who cannot join', () => {
    const results = computeResults(
      slots,
      [response(1, 'Olena', [slots[0]!]), response(2, 'Andrii', [slots[1]!])],
      60,
    );

    expect(results.perfectRanges).toEqual([]);
    expect(results.best[0]?.slot).toBe(slots[0]);
    expect(results.best[0]?.unavailable.map((p) => p.name)).toEqual(['Andrii']);
  });

  it('has no perfect ranges without respondents', () => {
    expect(computeResults(slots, [], 60).perfectRanges).toEqual([]);
  });
});
