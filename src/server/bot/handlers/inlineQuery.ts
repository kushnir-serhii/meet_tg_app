import type { Composer, Context } from 'grammy';

import type { Poll } from '@/domain/types';
import { getMessages, resolveLocale } from '@/i18n';

import { getEnv } from '../../env';
import { pollsRepository } from '../../repositories/pollsRepository';
import { buildPollArticle } from '../pollArticle';

const POLL_QUERY = /^(?:poll_)?([\w-]{6,32})$/;

const findPolls = async (
  query: string,
  userId: number,
): Promise<{ polls: Poll[]; single: boolean }> => {
  const pollId = POLL_QUERY.exec(query.trim())?.[1];
  if (pollId) {
    const poll = await pollsRepository.findById(pollId);
    return { polls: poll ? [poll] : [], single: true };
  }
  return { polls: await pollsRepository.findRecentByCreator(userId), single: false };
};

/** `@bot` → recent polls + "create" button; `@bot poll_<id>` → just that poll (no distractions). */
export const registerInlineQuery = (bot: Composer<Context>): void => {
  bot.on('inline_query', async (ctx) => {
    const t = getMessages(resolveLocale(ctx.from.language_code));
    const { polls, single } = await findPolls(ctx.inlineQuery.query, ctx.from.id);
    const results = await Promise.all(polls.map((poll) => buildPollArticle(poll, t, single)));
    // Sharing one poll: the only option is to send it. Otherwise also offer "create".
    const showCreate = !single || polls.length === 0;

    await ctx.answerInlineQuery(results, {
      cache_time: 0,
      is_personal: true,
      ...(showCreate && {
        button: { text: t.bot.inlineCreate, web_app: { url: getEnv().APP_URL } },
      }),
    });
  });
};
