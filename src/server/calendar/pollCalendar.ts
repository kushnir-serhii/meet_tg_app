import 'server-only';

import { buildGoogleCalendarUrl, type CalendarEvent } from '@/domain/calendar';
import { getAvailableForRange } from '@/domain/results';
import { generateSlots } from '@/domain/slots';
import type { CalendarLinks, Poll, PollResults } from '@/domain/types';
import { getMessages } from '@/i18n';
import { formatNames } from '@/shared/format';

import { getEnv } from '../env';
import { buildMiniAppLink } from '../telegram/links';

/** Calendar event for a scheduled poll (organizer's language), or null. */
export const buildPollEvent = (poll: Poll, results: PollResults): CalendarEvent | null => {
  if (!poll.scheduled) return null;
  const t = getMessages(poll.locale);
  const people = getAvailableForRange(poll.scheduled, generateSlots(poll), results);

  return {
    ...poll.scheduled,
    uid: `${poll.id}@pik-to-meet`,
    title: poll.title,
    description: t.schedule.calendarDetails(
      people.length > 0 ? formatNames(people) : null,
      buildMiniAppLink(poll.id),
    ),
  };
};

export const buildIcsUrl = (pollId: string): string =>
  new URL(`/api/polls/${encodeURIComponent(pollId)}/ics`, getEnv().APP_URL).toString();

export const buildCalendarLinks = (poll: Poll, results: PollResults): CalendarLinks | null => {
  const event = buildPollEvent(poll, results);
  if (!event) return null;
  return { google: buildGoogleCalendarUrl(event, poll.timezone), ics: buildIcsUrl(poll.id) };
};
