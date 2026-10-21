import { describe, expect, it } from 'vitest';

import { hasEnded, isBefore, startsInPast } from './pastTime';

const now = new Date('2026-10-16T15:00:00.000Z');
const range = (start: string, end: string) => ({ start, end });

describe('pastTime', () => {
  it('isBefore compares instants regardless of ISO format', () => {
    expect(isBefore('2026-10-16T14:59:59.000Z', now)).toBe(true);
    expect(isBefore('2026-10-16T15:00:00.000Z', now)).toBe(false);
    // 15:59:59+01:00 is 14:59:59Z — earlier, though a plain string compare ("15:59" > "15:00") says no.
    expect(isBefore('2026-10-16T15:59:59+01:00', now)).toBe(true);
    expect(isBefore('2026-10-16T16:00:00+01:00', now)).toBe(false);
  });

  it('hasEnded is true once the end is reached', () => {
    expect(hasEnded(range('2026-10-16T14:00:00.000Z', '2026-10-16T15:00:00.000Z'), now)).toBe(true);
    expect(hasEnded(range('2026-10-16T14:00:00.000Z', '2026-10-16T15:01:00.000Z'), now)).toBe(
      false,
    );
  });

  it('startsInPast allows starting exactly now', () => {
    expect(startsInPast(range('2026-10-16T14:00:00.000Z', '2026-10-16T16:00:00.000Z'), now)).toBe(
      true,
    );
    expect(startsInPast(range('2026-10-16T15:00:00.000Z', '2026-10-16T16:00:00.000Z'), now)).toBe(
      false,
    );
  });
});
