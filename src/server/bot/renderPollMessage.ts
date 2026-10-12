import type { InlineKeyboardMarkup } from 'grammy/types';

import type { Poll, PollResults, RangeSummary, SlotRange } from '@/domain/types';
import { copy } from '@/shared/copy';
import { formatNames, formatRange } from '@/shared/format';
import { escapeHtml } from '@/shared/html';

const MAX_PERFECT = 8;
const MAX_BEST = 5;

export type PollMessage = {
  text: string;
  replyMarkup: InlineKeyboardMarkup;
};

const renderRespondents = (poll: Poll, results: PollResults): string => {
  const { respondents } = results;
  if (respondents.length === 0) return copy.bot.nobody;
  return copy.bot.respondents(
    escapeHtml(formatNames(respondents)),
    respondents.length,
    poll.expectedCount,
  );
};

/** Renders up to `limit` items, then "…і ще N". */
const limitLines = <T>(items: T[], limit: number, render: (item: T) => string): string[] => {
  const lines = items.slice(0, limit).map(render);
  return items.length > limit ? [...lines, copy.bot.more(items.length - limit)] : lines;
};

const renderRange = (range: SlotRange, poll: Poll): string =>
  `• ${formatRange(range, poll.timezone)}`;

const renderBestRange = (range: RangeSummary, poll: Poll): string => {
  const line = renderRange(range, poll);
  if (range.unavailable.length === 0) return line;
  return `${line} (${copy.bot.cannot}: ${escapeHtml(formatNames(range.unavailable))})`;
};

const renderSummary = (poll: Poll, results: PollResults): string[] => {
  const total = results.respondents.length;
  if (total === 0) return [];

  if (results.perfectRanges.length > 0) {
    return [
      '',
      copy.bot.perfect(total),
      ...limitLines(results.perfectRanges, MAX_PERFECT, (r) => renderRange(r, poll)),
    ];
  }

  return [
    '',
    copy.bot.noCommon,
    copy.bot.best(results.bestCount, total),
    ...limitLines(results.bestRanges, MAX_BEST, (r) => renderBestRange(r, poll)),
  ];
};

export const renderPollMessage = (
  poll: Poll,
  results: PollResults,
  miniAppLink: string,
): PollMessage => {
  const lines = [
    `📅 <b>${escapeHtml(poll.title)}</b>`,
    '',
    renderRespondents(poll, results),
    ...renderSummary(poll, results),
    '',
    copy.bot.timezone(poll.timezone),
  ];

  return {
    text: lines.join('\n'),
    replyMarkup: { inline_keyboard: [[{ text: copy.bot.markButton, url: miniAppLink }]] },
  };
};
