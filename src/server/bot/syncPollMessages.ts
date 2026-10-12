import 'server-only';

import { type Api, GrammyError } from 'grammy';

import type { PollMessage as StoredMessage } from '../repositories/pollMessagesRepository';
import { pollMessagesRepository } from '../repositories/pollMessagesRepository';
import { getPollOrThrow, getPollResults } from '../services/pollService';
import { buildMiniAppLink } from '../telegram/links';
import { getBot } from './bot';
import { type PollMessage, renderPollMessage } from './renderPollMessage';

const isNotModified = (error: unknown): boolean =>
  error instanceof GrammyError && error.description.includes('message is not modified');

const editMessage = async (api: Api, target: StoredMessage, message: PollMessage) => {
  const options = { parse_mode: 'HTML', reply_markup: message.replyMarkup } as const;

  if (target.inline_message_id) {
    await api.editMessageTextInline(target.inline_message_id, message.text, options);
  } else if (target.chat_id !== null && target.message_id !== null) {
    await api.editMessageText(target.chat_id, target.message_id, message.text, options);
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
  const { api } = getBot();

  const outcomes = await Promise.allSettled(
    targets.map((target) => editMessage(api, target, message)),
  );

  for (const outcome of outcomes) {
    if (outcome.status === 'rejected' && !isNotModified(outcome.reason)) {
      console.error('Failed to sync poll message', outcome.reason);
    }
  }
};
