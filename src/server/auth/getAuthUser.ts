import 'server-only';

import type { Participant } from '@/domain/types';
import { type Locale, resolveLocale } from '@/i18n';
import { buildDisplayName } from '@/shared/format';

import { getEnv } from '../env';
import { unauthorized } from '../http/errors';
import { validateInitData } from '../telegram/initData';

const SCHEME = 'tma ';

export type AuthUser = Participant & { locale: Locale };

/** Reads `Authorization: tma <initData>` and returns the verified Telegram user. */
export const getAuthUser = (request: Request): AuthUser => {
  const header = request.headers.get('authorization') ?? '';
  if (!header.startsWith(SCHEME)) throw unauthorized();

  const data = validateInitData(header.slice(SCHEME.length), getEnv().TELEGRAM_BOT_TOKEN);
  if (!data) throw unauthorized('Invalid init data');

  const { id, first_name, last_name, username, language_code } = data.user;
  return {
    userId: id,
    name: buildDisplayName(first_name, last_name),
    username: username ?? null,
    locale: resolveLocale(language_code),
  };
};
