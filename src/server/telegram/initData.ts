import { createHmac, timingSafeEqual } from 'node:crypto';

import { z } from 'zod';

const MAX_AGE_SECONDS = 24 * 60 * 60;

const telegramUserSchema = z.object({
  id: z.number().int(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  language_code: z.string().optional(),
});

export type TelegramUser = z.infer<typeof telegramUserSchema>;

export type ValidatedInitData = {
  user: TelegramUser;
  authDate: number;
  startParam: string | null;
};

const hmac = (key: string | Buffer, data: string): Buffer =>
  createHmac('sha256', key).update(data).digest();

const buildDataCheckString = (params: URLSearchParams): string =>
  [...params.entries()]
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

const isHashValid = (params: URLSearchParams, botToken: string): boolean => {
  const hash = params.get('hash');
  if (!hash) return false;

  const secret = hmac('WebAppData', botToken);
  const expected = hmac(secret, buildDataCheckString(params));
  const received = Buffer.from(hash, 'hex');

  return received.length === expected.length && timingSafeEqual(received, expected);
};

/**
 * Validates Mini App `initData` per
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 * Returns null when the data is forged, expired or malformed.
 */
export const validateInitData = (
  initData: string,
  botToken: string,
  now = Math.floor(Date.now() / 1000),
): ValidatedInitData | null => {
  const params = new URLSearchParams(initData);
  if (!isHashValid(params, botToken)) return null;

  const authDate = Number(params.get('auth_date'));
  if (!Number.isFinite(authDate) || now - authDate > MAX_AGE_SECONDS) return null;

  try {
    const user = telegramUserSchema.parse(JSON.parse(params.get('user') ?? 'null'));
    return { user, authDate, startParam: params.get('start_param') };
  } catch {
    return null;
  }
};
