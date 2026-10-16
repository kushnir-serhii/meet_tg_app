import 'server-only';

import type { FeedbackSchemaInput } from '@/domain/validation';
import { escapeHtml } from '@/shared/html';

import type { AuthUser } from '../auth/getAuthUser';
import { getEnv } from '../env';
import { getBot } from './bot';

const renderFeedback = (user: AuthUser, input: FeedbackSchemaInput): string => {
  const stars = '★'.repeat(input.rating) + '☆'.repeat(5 - input.rating);
  const author = user.username
    ? `${escapeHtml(user.name)} (@${escapeHtml(user.username)})`
    : escapeHtml(user.name);

  return [
    `<b>New feedback</b> ${stars}`,
    `From: ${author} · <code>${user.userId}</code> · ${user.locale}`,
    `Can publish: ${input.canPublish ? 'yes' : 'no'}`,
    input.text ? `\n${escapeHtml(input.text)}` : '',
  ]
    .filter(Boolean)
    .join('\n');
};

/** DMs the app owner about a new review. No-op when `FEEDBACK_CHAT_ID` is unset. */
export const notifyFeedback = async (user: AuthUser, input: FeedbackSchemaInput): Promise<void> => {
  const chatId = getEnv().FEEDBACK_CHAT_ID;
  if (!chatId) return;

  try {
    await getBot().api.sendMessage(chatId, renderFeedback(user, input), { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Failed to send feedback notification', error);
  }
};
