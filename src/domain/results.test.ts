import { describe, expect, it } from 'vitest';

import { computeResults } from './results';
import { fitHourRange, generateSlots, normalizeSlotId } from './slots';
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

  it('returns all best ranges with names of those who cannot join', () => {
    const results = computeResults(
      slots,
      [response(1, 'Olena', [slots[0]!]), response(2, 'Andrii', [slots[1]!, slots[2]!])],
      60,
    );

    expect(results.perfectRanges).toEqual([]);
    expect(results.bestCount).toBe(1);
    expect(results.bestRanges.map((r) => [r.start, r.end])).toEqual([
      ['2026-10-20T16:00:00.000Z', '2026-10-20T17:00:00.000Z'],
      ['2026-10-20T17:00:00.000Z', '2026-10-20T19:00:00.000Z'],
    ]);
    expect(results.bestRanges[0]?.unavailable.map((p) => p.name)).toEqual(['Andrii']);
    expect(results.bestRanges[1]?.unavailable.map((p) => p.name)).toEqual(['Olena']);
  });

  it('keeps only slots with the highest availability', () => {
    const results = computeResults(
      slots,
      [
        response(1, 'Olena', slots),
        response(2, 'Andrii', [slots[2]!]),
        response(3, 'Marta', [slots[0]!]),
      ],
      60,
    );

    expect(results.bestCount).toBe(2);
    expect(results.bestRanges).toHaveLength(2);
  });

  it('has no perfect ranges without respondents', () => {
    expect(computeResults(slots, [], 60).perfectRanges).toEqual([]);
  });
});

describe('long slots', () => {
  it('only keeps slots that fully fit the hour range', () => {
    const fourHours = generateSlots({
      dates: ['2026-10-20'],
      hourFrom: 9,
      hourTo: 20,
      slotMinutes: 240,
      timezone: 'UTC',
    });
    expect(fourHours).toEqual(['2026-10-20T09:00:00.000Z', '2026-10-20T13:00:00.000Z']);
  });

  it('stretches the hour range to fit one slot', () => {
    expect(fitHourRange(22, 23, 180)).toEqual({ hourFrom: 21, hourTo: 24 });
    expect(fitHourRange(9, 21, 120)).toEqual({ hourFrom: 9, hourTo: 21 });
  });
});

describe('computeResults with equivalent slot id formats', () => {
  it('shows a cell both people marked as everyone once ids are normalized', () => {
    const [, mid] = slots;
    const variants = [
      '2026-10-20T17:00:00+00:00',
      '2026-10-20T17:00:00.000Z',
      '2026-10-20T19:00:00+02:00',
    ];
    expect(variants.map(normalizeSlotId)).toEqual([mid, mid, mid]);

    const responses = [
      response(1, 'A', [normalizeSlotId(variants[0] ?? '')]),
      response(2, 'B', [normalizeSlotId(variants[2] ?? '')]),
    ];
    const results = computeResults(slots, responses, 60);
    expect(results.perfectRanges).toEqual([{ start: mid, end: '2026-10-20T18:00:00.000Z' }]);
    expect(results.availability[mid ?? '']).toEqual([1, 2]);
  });

  it('un-normalized ids would NOT match (why mappers must normalize)', () => {
    const results = computeResults(
      slots,
      [response(1, 'A', ['2026-10-20T17:00:00+00:00']), response(2, 'B', [slots[1] ?? ''])],
      60,
    );
    expect(results.perfectRanges).toEqual([]);
  });
});
