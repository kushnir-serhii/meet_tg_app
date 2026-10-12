import { after, NextResponse } from 'next/server';

import { saveResponseSchema } from '@/domain/validation';
import { getAuthUser } from '@/server/auth/getAuthUser';
import { syncPollMessages } from '@/server/bot/syncPollMessages';
import { handle, readJson } from '@/server/http/handle';
import { saveResponse } from '@/server/services/pollService';

export const PUT = handle<RouteContext<'/api/polls/[id]/responses'>>(
  async (request, { params }) => {
    const user = getAuthUser(request);
    const { id } = await params;
    const { slots } = saveResponseSchema.parse(await readJson(request));

    const details = await saveResponse(id, user, slots);

    // Update chat messages after responding, so the user doesn't wait for Telegram.
    after(() => syncPollMessages(id));

    return NextResponse.json(details);
  },
);
