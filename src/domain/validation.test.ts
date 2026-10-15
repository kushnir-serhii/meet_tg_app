import { describe, expect, it } from 'vitest';

import { schedulePollSchema } from './validation';

const range = { start: '2026-10-20T16:00:00.000Z', end: '2026-10-20T17:00:00.000Z' };

describe('schedulePollSchema.meetingUrl', () => {
  it('is optional', () => {
    expect(schedulePollSchema.parse({ range }).meetingUrl).toBeNull();
    expect(schedulePollSchema.parse({ range, meetingUrl: null }).meetingUrl).toBeNull();
    expect(schedulePollSchema.parse({ range, meetingUrl: '   ' }).meetingUrl).toBeNull();
  });

  it('accepts and trims https links', () => {
    const { meetingUrl } = schedulePollSchema.parse({
      range,
      meetingUrl: ' https://meet.google.com/abc-defg-hij ',
    });
    expect(meetingUrl).toBe('https://meet.google.com/abc-defg-hij');
  });

  it.each(['http://zoom.us/j/1', 'meet.google.com/abc', 'javascript:alert(1)', 'https://'])(
    'rejects %s',
    (meetingUrl) => {
      expect(schedulePollSchema.safeParse({ range, meetingUrl }).success).toBe(false);
    },
  );
});
