import type { Composer, Context } from 'grammy';

import { getMessages, resolveLocale } from '@/i18n';

import { getEnv } from '../../env';

/** /start in private chat → button that opens the Mini App. */
export const registerStart = (bot: Composer<Context>): void => {
  bot.chatType('private').command('start', async (ctx) => {
    const t = getMessages(resolveLocale(ctx.from.language_code));
    await ctx.reply(t.bot.start, {
      reply_markup: {
        inline_keyboard: [[{ text: t.bot.createButton, web_app: { url: getEnv().APP_URL } }]],
      },
    });
  });
};
