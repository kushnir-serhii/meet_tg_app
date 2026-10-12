import type { SlotSummary } from '@/domain/types';
import { copy } from '@/shared/copy';
import { formatSlot } from '@/shared/format';

import { NameChips } from './NameChips';
import styles from './results.module.css';

type SlotDetailsProps = {
  summary: SlotSummary;
  total: number;
  timezone: string;
};

/** "пн, 20.10 18:00 — 4/5" + who can and who can't. */
export const SlotDetails = ({ summary, total, timezone }: SlotDetailsProps) => (
  <div className={styles.details}>
    <div className={styles.detailsHead}>
      <span>{formatSlot(summary.slot, timezone)}</span>
      <span className={styles.score}>{copy.results.of(summary.available.length, total)}</span>
    </div>
    <NameChips people={summary.available} />
    {summary.unavailable.length > 0 && (
      <>
        <span className={styles.subLabel}>{copy.results.cannot}</span>
        <NameChips people={summary.unavailable} muted />
      </>
    )}
  </div>
);
