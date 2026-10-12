export type SlotMinutes = 30 | 60;

export type Poll = {
  id: string;
  title: string;
  creatorId: number;
  creatorName: string;
  /** Local dates in the poll timezone, `YYYY-MM-DD`, sorted. */
  dates: string[];
  /** Inclusive start hour in the poll timezone. */
  hourFrom: number;
  /** Exclusive end hour in the poll timezone. */
  hourTo: number;
  slotMinutes: SlotMinutes;
  timezone: string;
  expectedCount: number | null;
  createdAt: string;
};

export type Participant = {
  userId: number;
  name: string;
  username: string | null;
};

export type PollResponse = Participant & {
  /** UTC ISO start times of the slots the participant can attend. */
  slots: string[];
  updatedAt: string;
};

export type SlotSummary = {
  slot: string;
  available: Participant[];
  unavailable: Participant[];
};

export type SlotRange = {
  start: string;
  /** Exclusive end (UTC ISO). */
  end: string;
};

export type PollResults = {
  respondents: Participant[];
  /** Ranges where every respondent is free. */
  perfectRanges: SlotRange[];
  /** Top slots when there is no perfect match (or as extra info). */
  best: SlotSummary[];
  /** User ids available per slot (only slots with at least one person). */
  availability: Record<string, number[]>;
};

export type PollDetails = {
  poll: Poll;
  results: PollResults;
  myResponse: PollResponse | null;
};
