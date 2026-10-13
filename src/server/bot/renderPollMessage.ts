import type { InlineKeyboardButton, InlineKeyboardMarkup } from 'grammy/types';

import type { CalendarLinks, Poll, PollResults, RangeSummary, SlotRange } from '@/domain/types';
import { getMessages, type Messages } from '@/i18n';
import { formatNames, formatRange } from '@/shared/format';
import { escapeHtml } from '@/shared/html';

const MAX_PERFECT = 8;
const MAX_BEST = 5;

export type PollMessage = {
  text: string;
  replyMarkup: InlineKeyboardMarkup;
};

/** Everything a line renderer needs: the poll and its (organizer's) language. */
type RenderContext = { poll: Poll; t: Messages };

const renderRespondents = ({ poll, t }: RenderContext, results: PollResults): string => {
  const { respondents } = results;
  if (respondents.length === 0) return t.bot.nobody;
  return t.bot.respondents(
    escapeHtml(formatNames(respondents)),
    respondents.length,
    poll.expectedCount,
  );
};

/** Renders up to `limit` items, then "…and N more". */
const limitLines = <T>(
  items: T[],
  limit: number,
  render: (item: T) => string,
  { t }: RenderContext,
): string[] => {
  const lines = items.slice(0, limit).map(render);
  return items.length > limit ? [...lines, t.bot.more(items.length - limit)] : lines;
};

const renderRange = (range: SlotRange, { poll }: RenderContext): string =>
  `• ${formatRange(range, poll.timezone, poll.locale)}`;

const renderBestRange = (range: RangeSummary, ctx: RenderContext): string => {
  const line = renderRange(range, ctx);
  if (range.unavailable.length === 0) return line;
  return `${line} — ${ctx.t.bot.cannot}: ${escapeHtml(formatNames(range.unavailable))}`;
};

const renderSummary = (ctx: RenderContext, results: PollResults): string[] => {
  const total = results.respondents.length;
  if (total === 0) return [];

  if (results.perfectRanges.length > 0) {
    const ranges = limitLines(results.perfectRanges, MAX_PERFECT, (r) => renderRange(r, ctx), ctx);
    return ['', ctx.t.bot.perfect, ...ranges];
  }

  const ranges = limitLines(results.bestRanges, MAX_BEST, (r) => renderBestRange(r, ctx), ctx);
  return ['', ctx.t.bot.noCommon, ctx.t.bot.best(results.bestCount, total), ...ranges];
};

const renderScheduled = ({ poll, t }: RenderContext): string[] =>
  poll.scheduled
    ? ['', t.bot.scheduled(formatRange(poll.scheduled, poll.timezone, poll.locale))]
    : [];

const renderKeyboard = (
  { t }: RenderContext,
  miniAppLink: string,
  calendar: CalendarLinks | null,
): InlineKeyboardButton[][] => {
  const mark = [{ text: t.bot.markButton, url: miniAppLink }];
  if (!calendar) return [mark];
  return [
    [{ text: t.bot.googleButton, url: calendar.google }],
    [{ text: t.bot.icsButton, url: calendar.ics }],
    mark,
  ];
};

/** Chat card of the poll, in the organizer's language. */
export const renderPollMessage = (
  poll: Poll,
  results: PollResults,
  miniAppLink: string,
  calendar: CalendarLinks | null = null,
): PollMessage => {
  const ctx: RenderContext = { poll, t: getMessages(poll.locale) };

  const lines = [
    `<b>${escapeHtml(poll.title)}</b>`,
    ...renderScheduled(ctx),
    '',
    renderRespondents(ctx, results),
    ...renderSummary(ctx, results),
    '',
    ctx.t.bot.timezone(poll.timezone),
  ];

  return {
    text: lines.join('\n'),
    replyMarkup: { inline_keyboard: renderKeyboard(ctx, miniAppLink, calendar) },
  };
};
