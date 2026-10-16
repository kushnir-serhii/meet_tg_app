import 'server-only';

import { z } from 'zod';

const envSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_WEBHOOK_SECRET: z.string().min(16),
  TELEGRAM_BOT_USERNAME: z.string().min(1),
  TELEGRAM_MINI_APP_SHORT_NAME: z.string().min(1),
  APP_URL: z.url(),
  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  /** Telegram chat (your user ID) that receives new feedback. Optional. */
  FEEDBACK_CHAT_ID: z.string().optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

let cached: ServerEnv | null = null;

/** Parsed lazily so `next build` works without secrets. */
export const getEnv = (): ServerEnv => {
  cached ??= envSchema.parse(process.env);
  return cached;
};
