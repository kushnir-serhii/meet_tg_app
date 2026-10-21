import { computeResults } from '@/domain/results';
import { generateSlots } from '@/domain/slots';
import type { CalendarLinks, Poll, PollResponse, PollResults, SlotRange } from '@/domain/types';

/** Fake data for the dev component gallery — never used by the real app. */

/** Two weeks from Mon 19 Oct 2026, as `YYYY-MM-DD`. */
const DATES = Array.from({ length: 14 }, (_, i) =>
  new Date(Date.UTC(2026, 9, 19 + i)).toISOString().slice(0, 10),
);

export const samplePoll: Poll = {
  id: 'dev-poll',
  title: 'Anthropic Certification',
  creatorId: 1,
  creatorName: 'Serhii Kushnir',
  dates: DATES,
  hourFrom: 9,
  hourTo: 21,
  slotMinutes: 30,
  timezone: 'Europe/Warsaw',
  expectedCount: 11,
  locale: 'uk',
  scheduled: null,
  meetingUrl: null,
  createdAt: '2026-10-18T10:00:00.000Z',
};

const allSlots = generateSlots(samplePoll);

/** Slots of `days` (indexes into DATES) whose local hour is in [from, to). */
const pick = (days: number[], from: number, to: number): string[] =>
  allSlots.filter((_, i) => {
    const perDay = allSlots.length / DATES.length;
    const day = Math.floor(i / perDay);
    const hour = samplePoll.hourFrom + ((i % perDay) * samplePoll.slotMinutes) / 60;
    return days.includes(day) && hour >= from && hour < to;
  });

const weekdays = [0, 1, 2, 3, 4, 5];
const everyDay = DATES.map((_, i) => i);

const respond = (userId: number, name: string, slots: string[]): PollResponse => ({
  userId,
  name,
  username: null,
  slots,
  updatedAt: '2026-10-20T10:00:00.000Z',
});

const NAMES = [
  'Serhii Kushnir',
  'Сергей Хабузов',
  'Nikita',
  'Viktor Shaparenko',
  'Mykola',
  'ya zhe vika',
] as const;

/** Each person's free time; user ids follow NAMES (the organizer is user 1). */
const PARTIAL_SLOTS = [
  pick(everyDay, 14, 21),
  pick(weekdays, 10, 15),
  pick([1, 2, 3], 9, 18),
  pick([0, 3, 4], 11, 14),
  pick([1, 3, 5], 12, 17),
  pick(weekdays, 16, 20),
];

/** Overlapping but never all together → "best options" view. */
export const partialResponses: PollResponse[] = NAMES.map((name, i) =>
  respond(i + 1, name, PARTIAL_SLOTS[i] ?? []),
);

/** Everyone shares Tue–Wed 14:00–16:00 → "works for everyone" view. */
export const perfectResponses: PollResponse[] = NAMES.map((name, i) =>
  respond(i + 1, name, [...pick([1, 2], 14, 16), ...pick([i], 9, 12)]),
);

const results = (responses: PollResponse[]): PollResults =>
  computeResults(allSlots, responses, samplePoll.slotMinutes);

export const partialResults = results(partialResponses);
export const perfectResults = results(perfectResponses);
export const emptyResults = results([]);

/** First "works for everyone" range: the window offered to the schedule form. */
export const perfectWindow: SlotRange = perfectResults.perfectRanges[0] ?? {
  start: allSlots[0] ?? '',
  end: allSlots[1] ?? '',
};

export const scheduledPoll: Poll = {
  ...samplePoll,
  scheduled: perfectWindow,
  meetingUrl: 'https://meet.google.com/abc-defg-hij',
};

export const sampleCalendar: CalendarLinks = {
  google: 'https://calendar.google.com/',
  ics: '#',
};
