export type CallService = {
  id: 'meet' | 'zoom' | 'teams';
  label: string;
  url: string;
};

/** Services where the organizer can quickly create a call (brand names, not translated). */
export const CALL_SERVICES: readonly CallService[] = [
  { id: 'meet', label: 'Google Meet', url: 'https://meet.google.com/new' },
  { id: 'zoom', label: 'Zoom', url: 'https://zoom.us/meeting/schedule' },
  { id: 'teams', label: 'Microsoft Teams', url: 'https://teams.microsoft.com/l/meeting/new' },
];
