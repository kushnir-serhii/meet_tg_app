import type { InlineKeyboardMarkup } from 'grammy/types';

import type { Poll, PollResults, SlotSummary } from '@/domain/types';
import { copy } from '@/shared/copy';
import { formatNames, formatRange, formatSlot } from '@/shared/format';

const MAX_RANGES = 3;

export type PollMessage = {
  text: string;
  replyMarkup: InlineKeyboardMarkup;
};

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const renderRespondents = (poll: Poll, results: PollResults): string => {
  const { respondents } = results;
  if (respondents.length === 0) return copy.bot.nobody;
  return copy.bot.respondents(
    escapeHtml(formatNames(respondents)),
    respondents.length,
    poll.expectedCount,
  );
};

const renderBestSlot = (poll: Poll, best: SlotSummary, total: number): string => {
  const line = `• ${formatSlot(best.slot, poll.timezone)} — ${best.available.length}/${total}`;
  if (best.unavailable.length === 0) return line;
  return `${line} (${copy.bot.cannot}: ${escapeHtml(formatNames(best.unavailable))})`;
};

const renderSummary = (poll: Poll, results: PollResults): string[] => {
  if (results.respondents.length === 0) return [];

  if (results.perfectRanges.length > 0) {
    const ranges = results.perfectRanges
      .slice(0, MAX_RANGES)
      .map((range) => `• ${formatRange(range, poll.timezone)}`);
    return [copy.bot.perfect, ...ranges];
  }

  const total = results.respondents.length;
  return [copy.bot.best, ...results.best.map((b) => renderBestSlot(poll, b, total))];
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
