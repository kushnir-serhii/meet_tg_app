import 'server-only';

import { buildTipPayload, type TipAmount } from '@/domain/tips';
import { getMessages, type Locale } from '@/i18n';

import { getBot } from '../bot/bot';

/** Telegram Stars use currency "XTR" and an empty provider token. */
const STARS_CURRENCY = 'XTR';

/** Creates a Stars invoice link the Mini App opens with `openInvoice`. */
export const createTipInvoice = (
  userId: number,
  amount: TipAmount,
  locale: Locale,
): Promise<string> => {
  const t = getMessages(locale);
  return getBot().api.createInvoiceLink(
    t.bot.tipTitle,
    t.bot.tipDescription(amount),
    buildTipPayload(userId, amount),
    '',
    STARS_CURRENCY,
    [{ label: t.bot.tipTitle, amount }],
  );
};
