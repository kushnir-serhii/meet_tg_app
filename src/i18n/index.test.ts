import { describe, expect, it } from 'vitest';

import { resolveLocale } from '.';

describe('resolveLocale', () => {
  it.each([
    ['uk', 'uk'],
    ['uk-UA', 'uk'],
    ['en-US', 'en'],
    ['pl', 'en'],
    [undefined, 'en'],
  ])('%s → %s', (code, expected) => {
    expect(resolveLocale(code)).toBe(expected);
  });
});
