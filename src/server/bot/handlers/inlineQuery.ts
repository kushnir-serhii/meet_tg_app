import type { Composer, Context } from 'grammy';
import type { InlineQueryResultArticle } from 'grammy/types';

import type { Poll } from '@/domain/types';
import { getMessages, resolveLocale } from '@/i18n';

import { getEnv } from '../../env';
import { pollsRepository } from '../../repositories/pollsRepository';
import { getPollResults } from '../../services/pollService';
import { buildMiniAppLink } from '../../telegram/links';
import { renderPollMessage } from '../renderPollMessage';

const POLL_QUERY = /^(?:poll_)?([\w-]{6,32})$/;

const toArticle = async (poll: Poll): Promise<InlineQueryResultArticle> => {
  const message = renderPollMessage(poll, await getPollResults(poll), buildMiniAppLink(poll.id));
  return {
    type: 'article',
    id: poll.id,
    title: poll.title,
    description: poll.timezone,
    input_message_content: { message_text: message.text, parse_mode: 'HTML' },
    reply_markup: message.replyMarkup,
  };
};

const findPolls = async (query: string, userId: number): Promise<Poll[]> => {
  const pollId = POLL_QUERY.exec(query.trim())?.[1];
  if (pollId) {
    const poll = await pollsRepository.findById(pollId);
    return poll ? [poll] : [];
  }
  return pollsRepository.findRecentByCreator(userId);
};

/** `@bot` → recent polls + "create" button; `@bot poll_<id>` → that poll. */
export const registerInlineQuery = (bot: Composer<Context>): void => {
  bot.on('inline_query', async (ctx) => {
    const polls = await findPolls(ctx.inlineQuery.query, ctx.from.id);
    const results = await Promise.all(polls.map(toArticle));
    const t = getMessages(resolveLocale(ctx.from.language_code));

    await ctx.answerInlineQuery(results, {
      cache_time: 0,
      is_personal: true,
      button: { text: t.bot.inlineCreate, web_app: { url: getEnv().APP_URL } },
    });
  });
};
