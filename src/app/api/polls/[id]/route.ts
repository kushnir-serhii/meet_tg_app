import { NextResponse } from 'next/server';

import { getAuthUser } from '@/server/auth/getAuthUser';
import { handle } from '@/server/http/handle';
import { getPollDetails } from '@/server/services/pollService';

export const GET = handle<RouteContext<'/api/polls/[id]'>>(async (request, { params }) => {
  const user = getAuthUser(request);
  const { id } = await params;

  return NextResponse.json(await getPollDetails(id, user.userId));
});
