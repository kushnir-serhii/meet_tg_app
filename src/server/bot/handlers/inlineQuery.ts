import type { Composer, Context } from 'grammy';
import type { InlineQueryResultArticle } from 'grammy/types';

import type { Poll } from '@/domain/types';
import { getMessages, type Messages, resolveLocale } from '@/i18n';

import { buildCalendarLinks } from '../../calendar/pollCalendar';
import { getEnv } from '../../env';
import { pollsRepository } from '../../repositories/pollsRepository';
import { getPollResults } from '../../services/pollService';
import { buildMiniAppLink } from '../../telegram/links';
import { renderPollMessage } from '../renderPollMessage';

const POLL_QUERY = /^(?:poll_)?([\w-]{6,32})$/;

/**
 * Inline results have no header, so each item says what tapping does:
 * one specific poll (Share button in the app) → "Send «X» to the chat";
 * a list of recent polls (typed `@bot`) → poll titles + "tap to send".
 */
const toArticle = async (
  poll: Poll,
  t: Messages,
  single: boolean,
): Promise<InlineQueryResultArticle> => {
  const results = await getPollResults(poll);
  const message = renderPollMessage(
    poll,
    results,
    buildMiniAppLink(poll.id),
    buildCalendarLinks(poll, results),
  );
  return {
    type: 'article',
    id: poll.id,
    title: single ? t.bot.inlineSendOne(poll.title) : t.bot.inlinePickTitle(poll.title),
    description: single
      ? t.bot.inlineSendOneHint
      : t.bot.inlinePickHint(results.respondents.length),
    input_message_content: { message_text: message.text, parse_mode: 'HTML' },
    reply_markup: message.replyMarkup,
  };
};

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
    const results = await Promise.all(polls.map((poll) => toArticle(poll, t, single)));
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
