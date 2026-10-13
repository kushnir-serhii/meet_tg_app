import { requiredEnv } from './env';

type TelegramResponse<T> = { ok: true; result: T } | { ok: false; description: string };

/** Calls a Bot API method and throws on `ok: false`. */
export const callTelegram = async <T>(
  method: string,
  body: Record<string, unknown>,
): Promise<T> => {
  const token = requiredEnv('TELEGRAM_BOT_TOKEN');
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as TelegramResponse<T>;
  if (!data.ok) throw new Error(`${method}: ${data.description}`);
  return data.result;
};
