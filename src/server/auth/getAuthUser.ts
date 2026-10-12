import 'server-only';

import type { Participant } from '@/domain/types';
import { buildDisplayName } from '@/shared/format';

import { getEnv } from '../env';
import { unauthorized } from '../http/errors';
import { validateInitData } from '../telegram/initData';

const SCHEME = 'tma ';

/** Reads `Authorization: tma <initData>` and returns the verified Telegram user. */
export const getAuthUser = (request: Request): Participant => {
  const header = request.headers.get('authorization') ?? '';
  if (!header.startsWith(SCHEME)) throw unauthorized();

  const data = validateInitData(header.slice(SCHEME.length), getEnv().TELEGRAM_BOT_TOKEN);
  if (!data) throw unauthorized('Invalid init data');

  const { id, first_name, last_name, username } = data.user;
  return {
    userId: id,
    name: buildDisplayName(first_name, last_name),
    username: username ?? null,
  };
};
