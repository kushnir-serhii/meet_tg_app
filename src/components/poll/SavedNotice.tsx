'use client';

import { useEffect, useRef } from 'react';

import { useI18n } from '@/hooks/useI18n';

import { Button } from '../ui/Button';
import styles from './poll.module.css';

type SavedNoticeProps = {
  /** Organizer right after creation — the poll is not in a chat yet. */
  beforeShare: boolean;
  /** Scroll into view only right after saving, not when returning to the tab. */
  autoScroll: boolean;
  /** Saved an empty selection: the answer was removed, not saved. */
  withdrawn?: boolean;
  onShowResults: () => void;
};

/** What happens next after saving: you can close the app, edit later, results go to the chat. */
export const SavedNotice = ({
  beforeShare,
  autoScroll,
  withdrawn = false,
  onShowResults,
}: SavedNoticeProps) => {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [autoScroll]);

  if (withdrawn) {
    return (
      <div ref={ref} className={styles.notice} role="status">
        <strong className={styles.noticeTitle}>{t.poll.withdrawnTitle}</strong>
        <p className={styles.noticeText}>{t.poll.withdrawnText}</p>
      </div>
    );
  }

  return (
    <div ref={ref} className={styles.notice} role="status">
      <strong className={styles.noticeTitle}>{t.poll.savedTitle}</strong>
      <ul className={styles.noticeList}>
        {(beforeShare ? t.poll.savedStepsBeforeShare : t.poll.savedSteps).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <Button onClick={onShowResults}>{t.poll.showResults}</Button>
    </div>
  );
};
