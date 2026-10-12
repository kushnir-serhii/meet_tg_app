import { createHmac } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { validateInitData } from './initData';

const BOT_TOKEN = '123456:TEST_TOKEN';
const NOW = 1_760_000_000;

const sign = (fields: Record<string, string>): string => {
  const dataCheckString = Object.entries(fields)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
  const secret = createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
  const hash = createHmac('sha256', secret).update(dataCheckString).digest('hex');
  return new URLSearchParams({ ...fields, hash }).toString();
};

const fields = {
  auth_date: String(NOW - 60),
  query_id: 'AAA',
  user: JSON.stringify({ id: 42, first_name: 'Olena', username: 'olena' }),
  start_param: 'abc123',
};

describe('validateInitData', () => {
  it('accepts correctly signed data', () => {
    const result = validateInitData(sign(fields), BOT_TOKEN, NOW);
    expect(result?.user.id).toBe(42);
    expect(result?.startParam).toBe('abc123');
  });

  it('rejects tampered data', () => {
    const tampered = sign(fields).replace('Olena', 'Hacker');
    expect(validateInitData(tampered, BOT_TOKEN, NOW)).toBeNull();
  });

  it('rejects expired data', () => {
    const old = sign({ ...fields, auth_date: String(NOW - 2 * 86_400) });
    expect(validateInitData(old, BOT_TOKEN, NOW)).toBeNull();
  });

  it('rejects a wrong bot token', () => {
    expect(validateInitData(sign(fields), '999:OTHER', NOW)).toBeNull();
  });
});
