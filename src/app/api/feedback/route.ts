import { after, NextResponse } from 'next/server';

import { feedbackSchema } from '@/domain/validation';
import { getAuthUser } from '@/server/auth/getAuthUser';
import { notifyFeedback } from '@/server/bot/notifyFeedback';
import { handle, readJson } from '@/server/http/handle';
import { feedbackRepository } from '@/server/repositories/feedbackRepository';

/** Saves (or replaces) the user's review and DMs it to the owner. */
export const POST = handle(async (request) => {
  const user = getAuthUser(request);
  const input = feedbackSchema.parse(await readJson(request));
  await feedbackRepository.upsert(user, input);
  after(() => notifyFeedback(user, input));

  return NextResponse.json({ ok: true });
});
