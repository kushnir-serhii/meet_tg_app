import { mergeSlotsIntoRanges } from './ranges';
import type { Participant, PollResponse, PollResults, SlotSummary } from './types';

const BEST_LIMIT = 3;

const toParticipant = ({ userId, name, username }: PollResponse): Participant => ({
  userId,
  name,
  username,
});

const summarizeSlot = (slot: string, responses: PollResponse[]): SlotSummary => {
  const available: Participant[] = [];
  const unavailable: Participant[] = [];

  for (const response of responses) {
    (response.slots.includes(slot) ? available : unavailable).push(toParticipant(response));
  }

  return { slot, available, unavailable };
};

/** Higher availability first; earlier slot wins a tie. */
const byAvailability = (a: SlotSummary, b: SlotSummary): number =>
  b.available.length - a.available.length || a.slot.localeCompare(b.slot);

export const computeResults = (
  slots: string[],
  responses: PollResponse[],
  slotMinutes: number,
): PollResults => {
  const summaries = slots.map((slot) => summarizeSlot(slot, responses));
  const availability = Object.fromEntries(
    summaries
      .filter((s) => s.available.length > 0)
      .map((s) => [s.slot, s.available.map((p) => p.userId)]),
  );

  const perfectSlots =
    responses.length > 0
      ? summaries.filter((s) => s.unavailable.length === 0).map((s) => s.slot)
      : [];

  const best = summaries
    .filter((s) => s.available.length > 0)
    .sort(byAvailability)
    .slice(0, BEST_LIMIT);

  return {
    respondents: responses.map(toParticipant),
    perfectRanges: mergeSlotsIntoRanges(perfectSlots, slotMinutes),
    best,
    availability,
  };
};

/** Rebuilds a slot summary on the client from `availability`. */
export const getSlotSummary = (slot: string, results: PollResults): SlotSummary => {
  const free = new Set(results.availability[slot] ?? []);
  return {
    slot,
    available: results.respondents.filter((p) => free.has(p.userId)),
    unavailable: results.respondents.filter((p) => !free.has(p.userId)),
  };
};
