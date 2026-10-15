import { FEEDBACK_RATINGS, type FeedbackRating } from '@/domain/feedback';
import { cx } from '@/utils/cx';

import styles from './feedback.module.css';

type RatingStarsProps = {
  value: FeedbackRating | null;
  label: (rating: number) => string;
  onChange: (rating: FeedbackRating) => void;
};

export const RatingStars = ({ value, label, onChange }: RatingStarsProps) => (
  <div className={styles.stars} role="radiogroup">
    {FEEDBACK_RATINGS.map((rating) => (
      <button
        key={rating}
        type="button"
        role="radio"
        aria-checked={value === rating}
        aria-label={label(rating)}
        className={cx(styles.star, value !== null && rating <= value && styles.starActive)}
        onClick={() => {
          onChange(rating);
        }}
      >
        ★
      </button>
    ))}
  </div>
);
