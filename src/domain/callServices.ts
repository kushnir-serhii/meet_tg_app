import { buildGoogleCalendarUrl } from './calendar';
import type { SlotRange } from './types';

/** The meeting being scheduled: prefilled into the service where it supports it. */
export type CallDraft = SlotRange & {
  title: string;
  timezone: string;
};

export type CallService = {
  id: 'meet' | 'zoom' | 'teams';
  label: string;
  /** Page that creates/schedules a call link — never one that starts a call right away. */
  buildUrl: (draft: CallDraft) => string;
};

/** Teams "schedule a meeting" deep link: subject and time come prefilled. */
export const buildTeamsUrl = ({ title, start, end }: CallDraft): string => {
  const params = new URLSearchParams({
    subject: title,
    startTime: new Date(start).toISOString(),
    endTime: new Date(end).toISOString(),
  });
  return `https://teams.microsoft.com/l/meeting/new?${params.toString()}`;
};

/** Services where the organizer can get a call link to copy (brand names, not translated). */
export const CALL_SERVICES: readonly CallService[] = [
  {
    id: 'meet',
    label: 'Google Calendar + Meet',
    // Meet itself takes no date: a prefilled Calendar event gets a Meet link on save.
    buildUrl: (draft) =>
      buildGoogleCalendarUrl({ ...draft, uid: '', description: '' }, draft.timezone),
  },
  // Zoom's schedule page has no URL parameters.
  { id: 'zoom', label: 'Zoom', buildUrl: () => 'https://zoom.us/meeting/schedule' },
  { id: 'teams', label: 'Microsoft Teams', buildUrl: buildTeamsUrl },
];
