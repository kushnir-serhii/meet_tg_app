import type { Composer, Context } from 'grammy';

import { isTipPayload } from '@/domain/tips';
import { getMessages, resolveLocale } from '@/i18n';

import { tipsRepository } from '../../repositories/tipsRepository';

/**
 * Telegram Stars flow: approve the checkout, then record the payment.
 * `/paysupport` is required by Telegram for bots that accept Stars.
 */
export const registerPayments = (bot: Composer<Context>): void => {
  bot.on('pre_checkout_query', async (ctx) => {
    const ok = isTipPayload(ctx.preCheckoutQuery.invoice_payload);
    await ctx.answerPreCheckoutQuery(ok);
  });

  bot.on('message:successful_payment', async (ctx) => {
    const payment = ctx.message.successful_payment;
    if (!isTipPayload(payment.invoice_payload)) return;

    await tipsRepository.insert(
      ctx.from.id,
      payment.total_amount,
      payment.telegram_payment_charge_id,
    );

    const t = getMessages(resolveLocale(ctx.from.language_code));
    await ctx.reply(t.bot.tipThanks(payment.total_amount));
  });

  bot.command('paysupport', async (ctx) => {
    const t = getMessages(resolveLocale(ctx.from?.language_code));
    await ctx.reply(t.bot.paySupport);
  });
};
