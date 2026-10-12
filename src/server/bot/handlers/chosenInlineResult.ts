import type { Composer, Context } from 'grammy';

import { pollMessagesRepository } from '../../repositories/pollMessagesRepository';

/**
 * Remembers where the inline message landed so it can be edited later.
 * Requires inline feedback: @BotFather → /setinlinefeedback → Enabled (100%).
 */
export const registerChosenInlineResult = (bot: Composer<Context>): void => {
  bot.on('chosen_inline_result', async (ctx) => {
    const { result_id: pollId, inline_message_id: inlineMessageId } = ctx.chosenInlineResult;
    if (!inlineMessageId) return;

    await pollMessagesRepository.addInline(pollId, inlineMessageId);
  });
};
