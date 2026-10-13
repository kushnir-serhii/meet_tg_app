import { buildIcs } from '@/domain/calendar';
import { buildPollEvent } from '@/server/calendar/pollCalendar';
import { notFound } from '@/server/http/errors';
import { handle } from '@/server/http/handle';
import { getPollOrThrow, getPollResults } from '@/server/services/pollService';

/**
 * Public `.ics` of the scheduled meeting — opened from the chat button and the Mini App
 * (no Telegram auth there). The poll id is unguessable, like the chat link itself.
 */
export const GET = handle<RouteContext<'/api/polls/[id]/ics'>>(async (_request, { params }) => {
  const { id } = await params;
  const poll = await getPollOrThrow(id);
  const event = buildPollEvent(poll, await getPollResults(poll));
  if (!event) throw notFound('The meeting is not scheduled');

  return new Response(buildIcs(event), {
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      'content-disposition': `attachment; filename="meeting-${id}.ics"`,
      'cache-control': 'no-store',
    },
  });
});
