import { NextResponse } from 'next/server';

import { createTipSchema } from '@/domain/validation';
import { getAuthUser } from '@/server/auth/getAuthUser';
import { handle, readJson } from '@/server/http/handle';
import { createTipInvoice } from '@/server/services/tipService';

/** Returns a Telegram Stars invoice link for a tip. */
export const POST = handle(async (request) => {
  const user = getAuthUser(request);
  const { amount } = createTipSchema.parse(await readJson(request));
  const link = await createTipInvoice(user.userId, amount, user.locale);

  return NextResponse.json({ link });
});
