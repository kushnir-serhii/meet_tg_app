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
    expect(text).toContain('(2/3): Olena, Andrii');
    expect(text).toContain('✅ Зручно всім (2):');
    expect(text).toContain('18:00–20:00');
  });

  it('names who cannot join when nobody fits all', () => {
    const { text } = render([response(1, 'Olena', [slots[0]!]), response(2, 'Andrii', [])]);
    expect(text).toContain('❌ Спільного часу поки немає');
    expect(text).toContain('можуть 1 з 2');
    expect(text).toContain('не може: Andrii');
  });
});
