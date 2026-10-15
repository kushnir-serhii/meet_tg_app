'use client';

import { useState } from 'react';

import { FEEDBACK_MAX_LENGTH, type FeedbackRating } from '@/domain/feedback';
import { useFeedback } from '@/hooks/useFeedback';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/useI18n';
import { cx } from '@/utils/cx';

import { Button } from '../ui/Button';
import { Field } from '../ui/Field';
import { ErrorText, Hint, Section } from '../ui/Section';
import styles from './feedback.module.css';
import { RatingStars } from './RatingStars';

/** Collapsed "Leave a review" prompt that expands into a rating + comment form. */
export const FeedbackSection = () => {
  const { t } = useI18n();
  const haptics = useHaptics();
  const { send, status } = useFeedback();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [text, setText] = useState('');
  const [canPublish, setCanPublish] = useState(true);

  if (status === 'sent') {
    return (
      <Section>
        <Hint>{t.feedback.thanks}</Hint>
      </Section>
    );
  }

  if (!isOpen) {
    return (
      <Section>
        <Hint>{t.feedback.prompt}</Hint>
        <Button
          variant="secondary"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {t.feedback.open}
        </Button>
      </Section>
    );
  }

  const pickRating = (next: FeedbackRating) => {
    haptics.selection();
    setRating(next);
  };

  return (
    <Section title={t.feedback.title}>
      <RatingStars value={rating} label={t.feedback.ratingLabel} onChange={pickRating} />
      <Field label={t.feedback.textLabel}>
        {(id, className) => (
          <textarea
            id={id}
            className={cx(className, styles.textarea)}
            rows={3}
            maxLength={FEEDBACK_MAX_LENGTH}
            placeholder={t.feedback.textPlaceholder}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
          />
        )}
      </Field>
      <label className={styles.consent}>
        <input
          type="checkbox"
          checked={canPublish}
          onChange={(event) => {
            setCanPublish(event.target.checked);
          }}
        />
        {t.feedback.consent}
      </label>
      {status === 'error' && <ErrorText>{t.app.genericError}</ErrorText>}
      <Button
        disabled={rating === null || status === 'sending'}
        onClick={() => {
          if (rating !== null) void send({ rating, text, canPublish });
        }}
      >
        {status === 'sending' ? t.feedback.sending : t.feedback.submit}
      </Button>
    </Section>
  );
};
