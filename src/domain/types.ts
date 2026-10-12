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

/** Continuous time range with the same set of available people. */
export type RangeSummary = SlotRange & {
  available: Participant[];
  unavailable: Participant[];
};

export type PollResults = {
  respondents: Participant[];
  /** All ranges where every respondent is free. */
  perfectRanges: SlotRange[];
  /** All ranges with the highest availability (used when nothing fits everyone). */
  bestRanges: RangeSummary[];
  /** How many people are free in `bestRanges`. */
  bestCount: number;
  /** User ids available per slot (only slots with at least one person). */
  availability: Record<string, number[]>;
};

export type PollDetails = {
  poll: Poll;
  results: PollResults;
  myResponse: PollResponse | null;
  /** True for the organizer (can delete the poll). */
  canManage: boolean;
};
