/**
 * Refunds a Telegram Stars tip and marks it as refunded.
 *
 *   npm run refund -- --list          last 20 tips
 *   npm run refund -- <charge_id>     refund one payment
 */
import { createScriptDb } from './lib/supabase';
import { callTelegram } from './lib/telegram';

type Db = ReturnType<typeof createScriptDb>;

const listTips = async (db: Db): Promise<void> => {
  const { data, error } = await db
    .from('tips')
    .select('user_id, amount, telegram_payment_charge_id, created_at, refunded_at')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;

  console.table(
    data.map((tip) => ({
      date: tip.created_at.slice(0, 16).replace('T', ' '),
      user: tip.user_id,
      stars: tip.amount,
      refunded: tip.refunded_at ? 'yes' : '',
      charge_id: tip.telegram_payment_charge_id,
    })),
  );
};

const refundTip = async (db: Db, chargeId: string): Promise<void> => {
  const { data: tip, error } = await db
    .from('tips')
    .select('user_id, amount, refunded_at')
    .eq('telegram_payment_charge_id', chargeId)
    .maybeSingle();
  if (error) throw error;
  if (!tip) throw new Error(`Payment not found: ${chargeId}`);
  if (tip.refunded_at) throw new Error(`Already refunded at ${tip.refunded_at}`);

  await callTelegram('refundStarPayment', {
    user_id: tip.user_id,
    telegram_payment_charge_id: chargeId,
  });

  const { error: updateError } = await db
    .from('tips')
    .update({ refunded_at: new Date().toISOString() })
    .eq('telegram_payment_charge_id', chargeId);
  if (updateError) throw updateError;

  console.log(`✓ Refunded ${tip.amount} ⭐ to user ${tip.user_id}`);
};

const [arg] = process.argv.slice(2);

if (!arg) {
  console.error('Usage: npm run refund -- --list | <charge_id>');
  process.exit(1);
}

try {
  const db = createScriptDb();
  await (arg === '--list' ? listTips(db) : refundTip(db, arg));
} catch (error) {
  // Supabase errors are plain objects with `message`, not Error instances.
  const message = (error as { message?: string }).message ?? String(error);
  console.error('✗', message);
  process.exit(1);
}
