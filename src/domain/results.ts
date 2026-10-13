import { mergeSlotsIntoRanges, mergeSummariesIntoRanges } from './ranges';
import type { Participant, PollResponse, PollResults, SlotRange, SlotSummary } from './types';

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

  const bestCount = Math.max(0, ...summaries.map((s) => s.available.length));
  const bestSlots = bestCount > 0 ? summaries.filter((s) => s.available.length === bestCount) : [];

  return {
    respondents: responses.map(toParticipant),
    perfectRanges: mergeSlotsIntoRanges(perfectSlots, slotMinutes),
    bestRanges: mergeSummariesIntoRanges(bestSlots, slotMinutes),
    bestCount,
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

/** Respondents free for every slot of `range` (slot ids of the poll, sorted). */
export const getAvailableForRange = (
  range: SlotRange,
  allSlots: readonly string[],
  results: PollResults,
): Participant[] => {
  const inRange = allSlots.filter((slot) => slot >= range.start && slot < range.end);
  return results.respondents.filter((person) =>
    inRange.every((slot) => results.availability[slot]?.includes(person.userId)),
  );
};

/** True when `range` is a run of consecutive poll slots (start/end on slot boundaries). */
export const isRangeOfSlots = (
  range: SlotRange,
  allSlots: readonly string[],
  slotMinutes: number,
): boolean => {
  const step = slotMinutes * 60_000;
  const start = new Date(range.start).getTime();
  const end = new Date(range.end).getTime();
  if (!(end > start) || (end - start) % step !== 0) return false;

  const known = new Set(allSlots);
  for (let time = start; time < end; time += step) {
    if (!known.has(new Date(time).toISOString())) return false;
  }
  return true;
};
