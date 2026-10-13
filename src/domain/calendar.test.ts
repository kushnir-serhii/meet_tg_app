import { describe, expect, it } from 'vitest';

import { buildGoogleCalendarUrl, buildIcs, type CalendarEvent } from './calendar';

const event: CalendarEvent = {
  uid: 'abc@pik-to-meet',
  title: 'Team sync; weekly, v2',
  description: 'Line one\nLine two',
  start: '2026-10-13T14:00:00.000Z',
  end: '2026-10-13T15:30:00.000Z',
};

describe('buildGoogleCalendarUrl', () => {
  it('prefills title, UTC dates, details and timezone', () => {
    const url = new URL(buildGoogleCalendarUrl(event, 'Europe/Warsaw'));
    expect(url.origin + url.pathname).toBe('https://calendar.google.com/calendar/render');
    expect(url.searchParams.get('action')).toBe('TEMPLATE');
    expect(url.searchParams.get('text')).toBe(event.title);
    expect(url.searchParams.get('dates')).toBe('20261013T140000Z/20261013T153000Z');
    expect(url.searchParams.get('details')).toBe(event.description);
    expect(url.searchParams.get('ctz')).toBe('Europe/Warsaw');
  });
});

describe('buildIcs', () => {
  const ics = buildIcs(event, new Date('2026-10-01T00:00:00Z'));

  it('contains one event with escaped text and CRLF endings', () => {
    expect(ics).toContain('DTSTART:20261013T140000Z\r\n');
    expect(ics).toContain('DTEND:20261013T153000Z\r\n');
    expect(ics).toContain('SUMMARY:Team sync\; weekly\\, v2\r\n');
    expect(ics).toContain('DESCRIPTION:Line one\\nLine two\r\n');
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });

  it('folds long lines to 75 octets', () => {
    const long = buildIcs({ ...event, description: 'ж'.repeat(100) });
    for (const line of long.split('\r\n')) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
  });
});
