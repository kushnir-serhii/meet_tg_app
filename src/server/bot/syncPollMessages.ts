import 'server-only';

import { type Api, GrammyError } from 'grammy';
import type { InlineKeyboardMarkup } from 'grammy/types';

import { copy } from '@/shared/copy';
import { escapeHtml } from '@/shared/html';

import type { PollMessage as StoredMessage } from '../repositories/pollMessagesRepository';
import { pollMessagesRepository } from '../repositories/pollMessagesRepository';
import { getPollOrThrow, getPollResults } from '../services/pollService';
import { buildMiniAppLink } from '../telegram/links';
import { getBot } from './bot';
import { renderPollMessage } from './renderPollMessage';

type Content = { text: string; replyMarkup?: InlineKeyboardMarkup };

const isNotModified = (error: unknown): boolean =>
  error instanceof GrammyError && error.description.includes('message is not modified');

/** Without `reply_markup` Telegram removes the inline keyboard. */
const editMessage = async (api: Api, target: StoredMessage, { text, replyMarkup }: Content) => {
  const options = { parse_mode: 'HTML', reply_markup: replyMarkup } as const;

  if (target.inline_message_id) {
    await api.editMessageTextInline(target.inline_message_id, text, options);
  } else if (target.chat_id !== null && target.message_id !== null) {
    await api.editMessageText(target.chat_id, target.message_id, text, options);
  }
};

const editAll = async (targets: StoredMessage[], content: Content): Promise<void> => {
  const { api } = getBot();
  const outcomes = await Promise.allSettled(
    targets.map((target) => editMessage(api, target, content)),
  );

  for (const outcome of outcomes) {
    if (outcome.status === 'rejected' && !isNotModified(outcome.reason)) {
      console.error('Failed to edit poll message', outcome.reason);
    }
  }
};

/** Re-renders every chat message of the poll with the latest results. */
export const syncPollMessages = async (pollId: string): Promise<void> => {
  const [poll, targets] = await Promise.all([
    getPollOrThrow(pollId),
    pollMessagesRepository.findByPoll(pollId),
  ]);
  if (targets.length === 0) return;

  const message = renderPollMessage(poll, await getPollResults(poll), buildMiniAppLink(poll.id));
  await editAll(targets, message);
};

/** Replaces chat messages of a deleted poll with a short note (and drops the button). */
export const markPollMessagesDeleted = async (
  targets: StoredMessage[],
  title: string,
): Promise<void> => {
  if (targets.length === 0) return;
  await editAll(targets, { text: copy.bot.deleted(escapeHtml(title)) });
};
