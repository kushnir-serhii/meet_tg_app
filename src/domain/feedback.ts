export const FEEDBACK_RATINGS = [1, 2, 3, 4, 5] as const;

export type FeedbackRating = (typeof FEEDBACK_RATINGS)[number];

export const FEEDBACK_MAX_LENGTH = 500;

export type FeedbackInput = {
  rating: FeedbackRating;
  text: string;
  /** User agreed to show the review publicly with their name. */
  canPublish: boolean;
};
