import { describe, expect, it } from 'vitest';

import { buildTipPayload, isTipAmount, isTipPayload } from './tips';

describe('tips', () => {
  it('accepts only predefined amounts', () => {
    expect(isTipAmount(50)).toBe(true);
    expect(isTipAmount(7)).toBe(false);
  });

  it('builds and recognizes the payload', () => {
    const payload = buildTipPayload(42, 50);
    expect(payload).toBe('tip:42:50');
    expect(isTipPayload(payload)).toBe(true);
    expect(isTipPayload('pro:42')).toBe(false);
  });
});
