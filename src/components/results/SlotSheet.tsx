'use client';

import { useEffect } from 'react';

import styles from './results.module.css';
import { SlotSummaryCard, type SlotSummaryCardProps } from './SlotSummaryCard';

type SlotSheetProps = SlotSummaryCardProps & { onClose: () => void };

/** Touch devices: bottom sheet for a tapped heatmap cell. */
export const SlotSheet = ({ onClose, ...summary }: SlotSheetProps) => {
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
        aria-label={summary.label}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <SlotSummaryCard {...summary} onClose={onClose} />
      </div>
    </div>
  );
};
