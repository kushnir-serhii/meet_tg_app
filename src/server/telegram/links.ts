import 'server-only';

import { getEnv } from '../env';

/** Direct Mini App link — works in groups and inline messages (web_app buttons don't). */
export const buildMiniAppLink = (pollId?: string): string => {
  const { TELEGRAM_BOT_USERNAME, TELEGRAM_MINI_APP_SHORT_NAME } = getEnv();
  const base = `https://t.me/${TELEGRAM_BOT_USERNAME}/${TELEGRAM_MINI_APP_SHORT_NAME}`;
  return pollId ? `${base}?startapp=${encodeURIComponent(pollId)}` : base;
};

/**
 * Same link for the landing page; reads env directly so a static build
 * doesn't fail when bot settings are missing (returns null then).
 */
export const getPublicMiniAppLink = (): string | null => {
  const username = process.env.TELEGRAM_BOT_USERNAME;
  const shortName = process.env.TELEGRAM_MINI_APP_SHORT_NAME;
  return username && shortName ? `https://t.me/${username}/${shortName}` : null;
};
