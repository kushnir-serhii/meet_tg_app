import { describe, expect, it } from 'vitest';

import { findRangeWithSlot } from './ranges';

const ranges = [
  { start: '2026-10-20T12:00:00.000Z', end: '2026-10-20T14:00:00.000Z' },
  { start: '2026-10-21T16:00:00.000Z', end: '2026-10-21T17:00:00.000Z' },
];

describe('findRangeWithSlot', () => {
  it('finds the range a slot starts in, end exclusive', () => {
    expect(findRangeWithSlot(ranges, '2026-10-20T12:00:00.000Z')).toBe(ranges[0]);
    expect(findRangeWithSlot(ranges, '2026-10-20T13:30:00.000Z')).toBe(ranges[0]);
    expect(findRangeWithSlot(ranges, '2026-10-20T14:00:00.000Z')).toBeUndefined();
  });

  it('compares instants, not strings', () => {
    expect(findRangeWithSlot(ranges, '2026-10-21T18:30:00+02:00')).toBe(ranges[1]);
  });
});
