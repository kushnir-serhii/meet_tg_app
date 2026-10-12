import type { Participant } from '@/domain/types';
import { copy } from '@/shared/copy';

import { NameChips } from './NameChips';
import styles from './results.module.css';

type SlotDetailsProps = {
  label: string;
  available: Participant[];
  unavailable: Participant[];
  total: number;
};

/** "вт, 13.10 18:00–20:00 — 4/5" + who can and who can't. */
export const SlotDetails = ({ label, available, unavailable, total }: SlotDetailsProps) => (
  <div className={styles.details}>
    <div className={styles.detailsHead}>
      <span>{label}</span>
      <span className={styles.score}>{copy.results.of(available.length, total)}</span>
    </div>
    <NameChips people={available} />
    {unavailable.length > 0 && (
      <>
        <span className={styles.subLabel}>{copy.results.cannot}</span>
        <NameChips people={unavailable} muted />
      </>
    )}
  </div>
);
