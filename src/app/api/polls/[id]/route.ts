import { after, NextResponse } from 'next/server';

import { getAuthUser } from '@/server/auth/getAuthUser';
import { markPollMessagesDeleted } from '@/server/bot/syncPollMessages';
import { handle } from '@/server/http/handle';
import { deletePoll, getPollDetails } from '@/server/services/pollService';

type Context = RouteContext<'/api/polls/[id]'>;

export const GET = handle<Context>(async (request, { params }) => {
  const user = getAuthUser(request);
  const { id } = await params;

  return NextResponse.json(await getPollDetails(id, user.userId));
});

/** Organizer only. Removes the poll + responses and updates chat messages. */
export const DELETE = handle<Context>(async (request, { params }) => {
  const user = getAuthUser(request);
  const { id } = await params;

  const { poll, messages } = await deletePoll(id, user.userId);
  after(() => markPollMessagesDeleted(messages, poll.title));

  return NextResponse.json({ ok: true });
});
