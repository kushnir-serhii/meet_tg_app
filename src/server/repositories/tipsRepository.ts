import 'server-only';

import { getDb } from '../db/client';

export const tipsRepository = {
  /** Idempotent: the same Telegram charge is stored once. */
  async insert(userId: number, amount: number, chargeId: string): Promise<void> {
    const { error } = await getDb()
      .from('tips')
      .upsert(
        { user_id: userId, amount, telegram_payment_charge_id: chargeId },
        { onConflict: 'telegram_payment_charge_id', ignoreDuplicates: true },
      );
    if (error) throw error;
  },
};
