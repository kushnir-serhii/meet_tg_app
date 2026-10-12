import { webhookCallback } from 'grammy';

import { getBot } from '@/server/bot/bot';
import { getEnv } from '@/server/env';

export const dynamic = 'force-dynamic';

type WebhookHandler = (request: Request) => Promise<Response>;

let handler: WebhookHandler | null = null;

const getHandler = (): WebhookHandler => {
  // Secret is checked by grammY via the `X-Telegram-Bot-Api-Secret-Token` header.
  handler ??= webhookCallback(getBot(), 'std/http', {
    secretToken: getEnv().TELEGRAM_WEBHOOK_SECRET,
  });
  return handler;
};

/** Telegram webhook endpoint. */
export const POST = (request: Request): Promise<Response> => getHandler()(request);
