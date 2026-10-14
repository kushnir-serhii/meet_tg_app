import { describe, expect, it } from 'vitest';

import { computeResults } from '@/domain/results';
import { generateSlots } from '@/domain/slots';
import type { Poll, PollResponse } from '@/domain/types';

import { renderPollMessage } from './renderPollMessage';

const poll: Poll = {
  id: 'abc123XYZ0',
  title: 'Team <call>',
  creatorId: 1,
  creatorName: 'Serhii',
  dates: ['2026-10-20'],
  hourFrom: 18,
  hourTo: 20,
  slotMinutes: 60,
  timezone: 'Europe/Warsaw',
  expectedCount: 3,
  locale: 'en',
  scheduled: null,
  createdAt: '2026-10-12T00:00:00.000Z',
};

const slots = generateSlots(poll);

const response = (userId: number, name: string, picked: string[]): PollResponse => ({
  userId,
  name,
  username: null,
  slots: picked,
  updatedAt: '2026-10-12T00:00:00.000Z',
});

const render = (responses: PollResponse[]) =>
  renderPollMessage(poll, computeResults(slots, responses, 60), 'https://t.me/bot/app?startapp=x');

describe('renderPollMessage', () => {
  it('escapes HTML and adds the Mini App button', () => {
    const { text, replyMarkup } = render([]);
    expect(text).toContain('Team &lt;call&gt;');
    expect(replyMarkup.inline_keyboard[0]?.[0]).toMatchObject({
      url: 'https://t.me/bot/app?startapp=x',
    });
  });

  it('shows respondents and a perfect range', () => {
    const { text } = render([response(1, 'Olena', slots), response(2, 'Andrii', slots)]);
    expect(text).toContain('Responded 2/3: Olena, Andrii');
    expect(text).toContain('✅ Works for everyone:');
    expect(text).toContain('18:00–20:00');
  });

  it('does not claim "works for everyone" with a single answer', () => {
    const { text } = render([response(1, 'Olena', slots)]);
    expect(text).toContain('🗓 One answer so far — free time:');
    expect(text).not.toContain('Works for everyone');
  });

  it('names who cannot join when nobody fits all', () => {
    const { text } = render([response(1, 'Olena', [slots[0]!]), response(2, 'Andrii', [])]);
    expect(text).toContain('❌ No common time yet');
    expect(text).toContain('1 of 2 can join');
    expect(text).toContain("can't: Andrii");
  });

  it('uses the organizer language', () => {
    const results = computeResults(slots, [response(1, 'Olena', slots)], 60);
    const { text, replyMarkup } = renderPollMessage({ ...poll, locale: 'uk' }, results, 'u');
    expect(text).toContain('Відповіли 1/3: Olena');
    expect(text).toContain('🗓 Поки одна відповідь — ось вільний час:');
    expect(replyMarkup.inline_keyboard[0]?.[0]?.text).toBe('🗓 Позначити свій час');
  });

  it('shows the scheduled time and calendar buttons', () => {
    const scheduled = { start: slots[0]!, end: slots[1]! };
    const { text, replyMarkup } = renderPollMessage(
      { ...poll, scheduled },
      computeResults(slots, [], 60),
      'mini',
      { google: 'https://calendar.google.com/x', ics: 'https://app/ics' },
    );
    expect(text).toContain('📌 <b>Meeting scheduled: Tue 20 Oct 18:00–19:00</b>');
    expect(
      replyMarkup.inline_keyboard.map((row) => (row[0] as { url?: string } | undefined)?.url),
    ).toEqual(['https://calendar.google.com/x', 'https://app/ics', 'mini']);
  });
});
