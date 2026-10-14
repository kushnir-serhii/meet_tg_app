import 'server-only';

import type { InlineQueryResultArticle } from 'grammy/types';

import type { Poll } from '@/domain/types';
import type { Messages } from '@/i18n';

import { buildCalendarLinks } from '../calendar/pollCalendar';
import { getPollResults } from '../services/pollService';
import { buildMiniAppLink } from '../telegram/links';
import { renderPollMessage } from './renderPollMessage';

/**
 * The poll card as an inline result — used by inline mode and by native sharing.
 * Its id is the poll id, so `chosen_inline_result` can bind the sent message to the poll.
 * Inline results have no header, so title/description say what tapping does:
 * one poll (`single`) → "📤 X / Add to chat"; a list → "📅 X / Add to chat · responded: N".
 */
export const buildPollArticle = async (
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
