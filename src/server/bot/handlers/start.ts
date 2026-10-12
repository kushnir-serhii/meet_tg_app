import type { Composer, Context } from 'grammy';

import { copy } from '@/shared/copy';

import { getEnv } from '../../env';

/** /start in private chat → button that opens the Mini App. */
export const registerStart = (bot: Composer<Context>): void => {
  bot.chatType('private').command('start', async (ctx) => {
    await ctx.reply(copy.bot.start, {
      reply_markup: {
        inline_keyboard: [[{ text: copy.bot.createButton, web_app: { url: getEnv().APP_URL } }]],
      },
    });
  });
};
