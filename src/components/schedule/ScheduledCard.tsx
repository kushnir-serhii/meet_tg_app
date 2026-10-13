'use client';

import type { CalendarLinks, Poll } from '@/domain/types';
import { useConfirm } from '@/hooks/useConfirm';
import { useI18n } from '@/hooks/useI18n';
import { useOpenLink } from '@/hooks/useOpenLink';
import { formatRange } from '@/shared/format';

import { Button } from '../ui/Button';
import { Section } from '../ui/Section';
import styles from './schedule.module.css';

type ScheduledCardProps = {
  poll: Poll;
  calendar: CalendarLinks;
  canManage: boolean;
  isSaving: boolean;
  onChange: () => void;
  onUnschedule: () => void;
};

/** The chosen meeting time with "add to calendar" buttons (for everyone). */
export const ScheduledCard = ({
  poll,
  calendar,
  canManage,
  isSaving,
  onChange,
  onUnschedule,
}: ScheduledCardProps) => {
  const { t, locale } = useI18n();
  const openLink = useOpenLink();
  const confirm = useConfirm();
  if (!poll.scheduled) return null;

  return (
    <Section title={t.schedule.scheduledTitle}>
      <p className={styles.when}>{formatRange(poll.scheduled, poll.timezone, locale)}</p>
      <div className={styles.actions}>
        <Button
          onClick={() => {
            openLink(calendar.google);
          }}
        >
          {t.schedule.addGoogle}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            openLink(calendar.ics);
          }}
        >
          {t.schedule.addIcs}
        </Button>
      </div>
      {canManage && (
        <div className={styles.manage}>
          <button type="button" className={styles.textButton} onClick={onChange}>
            {t.schedule.change}
          </button>
          <button
            type="button"
            className={styles.textButton}
            disabled={isSaving}
            onClick={() => {
              void confirm(t.schedule.unscheduleConfirm).then((ok) => {
                if (ok) onUnschedule();
              });
            }}
          >
            {t.schedule.unschedule}
          </button>
        </div>
      )}
    </Section>
  );
};
