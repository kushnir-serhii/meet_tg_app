import { NextResponse } from 'next/server';

import { createPollSchema } from '@/domain/validation';
import { getAuthUser } from '@/server/auth/getAuthUser';
import { handle, readJson } from '@/server/http/handle';
import { createPoll } from '@/server/services/pollService';

export const POST = handle(async (request) => {
  const user = getAuthUser(request);
  const input = createPollSchema.parse(await readJson(request));
  const poll = await createPoll(input, user);

  return NextResponse.json({ poll }, { status: 201 });
});
