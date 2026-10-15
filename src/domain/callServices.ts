export type CallService = {
  id: 'meet' | 'zoom' | 'teams';
  label: string;
  url: string;
};

/**
 * Services where the organizer can get a call link to copy (brand names, not translated).
 * The URLs must lead to a page that creates/schedules a link, never one that starts a call.
 */
export const CALL_SERVICES: readonly CallService[] = [
  { id: 'meet', label: 'Google Meet', url: 'https://meet.google.com/' },
  { id: 'zoom', label: 'Zoom', url: 'https://zoom.us/meeting/schedule' },
  { id: 'teams', label: 'Microsoft Teams', url: 'https://teams.microsoft.com/l/meeting/new' },
];
