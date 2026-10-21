'use client';

import { useEffect } from 'react';

import type { Participant } from '@/domain/types';
import { useI18n } from '@/hooks/useI18n';

import styles from './results.module.css';

type SlotSheetProps = {
  label: string;
  available: Participant[];
  unavailable: Participant[];
  total: number;
  /** Invited but not answered yet; null when the organizer gave no expected count. */
  notResponded: number | null;
  onClose: () => void;
};

/** Bottom sheet for a tapped heatmap cell: who can join and who can't, side by side. */
export const SlotSheet = ({
  label,
  available,
  unavailable,
  total,
  notResponded,
  onClose,
}: SlotSheetProps) => {
  const { t } = useI18n();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className={styles.sheetBackdrop} onClick={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className={styles.detailsHead}>
          <span>{label}</span>
          <span className={styles.sheetHeadRight}>
            <span className={styles.score}>{t.results.of(available.length, total)}</span>
            <button
              type="button"
              className={styles.sheetClose}
              aria-label={t.results.closeDetails}
              onClick={onClose}
            >
              ×
            </button>
          </span>
        </div>
        <div className={styles.sheetColumns}>
          <PeopleColumn title={t.results.canCount(available.length)} people={available} />
          <PeopleColumn
            title={t.results.cannotCount(unavailable.length)}
            people={unavailable}
            muted
          />
        </div>
        {notResponded !== null && notResponded > 0 && (
          <span className={styles.subLabel}>{t.results.notResponded(notResponded)}</span>
        )}
      </div>
    </div>
  );
};

type PeopleColumnProps = {
  title: string;
  people: Participant[];
  muted?: boolean;
};

const PeopleColumn = ({ title, people, muted = false }: PeopleColumnProps) => (
  <div className={styles.sheetColumn}>
    <span className={styles.subLabel}>{title}</span>
    <ul className={muted ? styles.sheetListMuted : styles.sheetList}>
      {people.length > 0 ? (
        people.map((person) => <li key={person.userId}>{person.name}</li>)
      ) : (
        <li aria-hidden>—</li>
      )}
    </ul>
  </div>
);
