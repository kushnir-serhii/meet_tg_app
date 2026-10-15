'use client';

import { useEffect, useState } from 'react';

import { FEEDBACK_MAX_LENGTH, type FeedbackRating } from '@/domain/feedback';
import { useFeedback } from '@/hooks/useFeedback';
import { useFeedbackDismiss } from '@/hooks/useFeedbackDismiss';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/useI18n';
import { cx } from '@/utils/cx';

import { Button } from '../ui/Button';
import { Field } from '../ui/Field';
import { ErrorText, Hint, Section } from '../ui/Section';
import { DismissButton } from './DismissButton';
import styles from './feedback.module.css';
import { RatingStars } from './RatingStars';

/** Rating prompt: tapping a star expands it into a comment form. Can be dismissed. */
export const FeedbackSection = () => {
  const { t } = useI18n();
  const haptics = useHaptics();
  const { send, status } = useFeedback();
  const { isDismissed, dismiss, markSent } = useFeedbackDismiss();
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [text, setText] = useState('');
  const [canPublish, setCanPublish] = useState(false);

  useEffect(() => {
    if (status === 'sent') markSent();
  }, [status, markSent]);

  if (status === 'sent') {
    return (
      <Section>
        <Hint>{t.feedback.thanks}</Hint>
      </Section>
    );
  }

  if (isDismissed) return null;

  const pickRating = (next: FeedbackRating) => {
    haptics.selection();
    setRating(next);
  };

  const handleDismiss = () => {
    haptics.selection();
    dismiss();
  };

  return (
    <div className={styles.root}>
      <DismissButton label={t.feedback.dismiss} onClick={handleDismiss} />
      <Section title={rating === null ? undefined : t.feedback.title}>
        {rating === null && <Hint>{t.feedback.prompt}</Hint>}
        <RatingStars value={rating} label={t.feedback.ratingLabel} onChange={pickRating} />
        {rating !== null && (
          <>
            <Field label={t.feedback.textLabel}>
              {(id, className) => (
                <textarea
                  id={id}
                  className={cx(className, styles.textarea)}
                  name="pik-feedback-text"
                  autoComplete="off"
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
              loading={status === 'sending'}
              onClick={() => {
                void send({ rating, text, canPublish });
              }}
            >
              {t.feedback.submit}
            </Button>
          </>
        )}
      </Section>
    </div>
  );
};
