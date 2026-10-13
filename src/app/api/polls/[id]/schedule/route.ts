import { after, NextResponse } from 'next/server';

import { schedulePollSchema } from '@/domain/validation';
import { getAuthUser } from '@/server/auth/getAuthUser';
import { syncPollMessages } from '@/server/bot/syncPollMessages';
import { handle, readJson } from '@/server/http/handle';
import { schedulePoll } from '@/server/services/pollService';

/** Organizer only. Sets or clears the meeting time and updates chat messages. */
export const PUT = handle<RouteContext<'/api/polls/[id]/schedule'>>(async (request, { params }) => {
  const user = getAuthUser(request);
  const { id } = await params;
  const { range } = schedulePollSchema.parse(await readJson(request));

  const details = await schedulePoll(id, user.userId, range);
  after(() => syncPollMessages(id));

  return NextResponse.json(details);
});
