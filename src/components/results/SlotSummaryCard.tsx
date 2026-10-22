import type { Participant } from '@/domain/types';
import { useI18n } from '@/hooks/useI18n';

import styles from './results.module.css';

export type SlotSummaryCardProps = {
  label: string;
  available: Participant[];
  unavailable: Participant[];
  total: number;
  /** Invited but not answered yet; null when the organizer gave no expected count. */
  notResponded: number | null;
  /** Extra hint under the lists, e.g. how to find this time in the options list. */
  footnote?: string;
  /** Shows a × button (the phone sheet); the desktop hover card has none. */
  onClose?: () => void;
};

/** Slot time + score, then who can join and who can't, side by side. */
export const SlotSummaryCard = ({
  label,
  available,
  unavailable,
  total,
  notResponded,
  footnote,
  onClose,
}: SlotSummaryCardProps) => {
  const { t } = useI18n();

  return (
    <>
      <div className={styles.detailsHead}>
        <span>{label}</span>
        <span className={styles.sheetHeadRight}>
          <span className={styles.score}>{t.results.of(available.length, total)}</span>
          {onClose && (
            <button
              type="button"
              className={styles.sheetClose}
              aria-label={t.results.closeDetails}
              onClick={onClose}
            >
              ×
            </button>
          )}
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
      {footnote && <span className={styles.locateHint}>{footnote}</span>}
    </>
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
