import { describe, expect, it } from 'vitest';

import { CALL_SERVICES, type CallDraft } from './callServices';

const draft: CallDraft = {
  title: 'Team sync',
  start: '2026-10-16T13:00:00.000Z',
  end: '2026-10-16T14:00:00.000Z',
  timezone: 'Europe/Warsaw',
};

const urlFor = (id: string) => {
  const service = CALL_SERVICES.find((s) => s.id === id);
  if (!service) throw new Error(id);
  return new URL(service.buildUrl(draft));
};

describe('CALL_SERVICES', () => {
  it('Google Meet opens a prefilled Calendar event', () => {
    const url = urlFor('meet');
    expect(url.hostname).toBe('calendar.google.com');
    expect(url.searchParams.get('text')).toBe('Team sync');
    expect(url.searchParams.get('dates')).toBe('20261016T130000Z/20261016T140000Z');
  });

  it('Teams prefills subject and time', () => {
    const url = urlFor('teams');
    expect(url.pathname).toBe('/l/meeting/new');
    expect(url.searchParams.get('subject')).toBe('Team sync');
    expect(url.searchParams.get('startTime')).toBe(draft.start);
    expect(url.searchParams.get('endTime')).toBe(draft.end);
  });

  it('Zoom keeps its plain schedule page', () => {
    expect(urlFor('zoom').href).toBe('https://zoom.us/meeting/schedule');
  });
});
