import type { Participant } from '@/domain/types';
import { useI18n } from '@/hooks/useI18n';

import { NameChips } from './NameChips';
import styles from './results.module.css';

type SlotDetailsProps = {
  label: string;
  available: Participant[];
  unavailable: Participant[];
  total: number;
};

/** "Tue 13 Oct 18:00–20:00 — 4/5" + who can and who can't. */
export const SlotDetails = ({ label, available, unavailable, total }: SlotDetailsProps) => {
  const { t } = useI18n();

  return (
    <div className={styles.details}>
      <div className={styles.detailsHead}>
        <span>{label}</span>
        <span className={styles.score}>{t.results.of(available.length, total)}</span>
      </div>
      <NameChips people={available} />
      {unavailable.length > 0 && (
        <>
          <span className={styles.subLabel}>{t.results.cannot}</span>
          <NameChips people={unavailable} muted />
        </>
      )}
    </div>
  );
};
