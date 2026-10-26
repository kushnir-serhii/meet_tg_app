import { useEffect, useRef, useState } from 'react';

import type { RangeSummary, SlotRange } from '@/domain/types';
import { useI18n } from '@/hooks/useI18n';
import { formatRange } from '@/shared/format';
import { cx } from '@/utils/cx';

import { Section } from '../ui/Section';
import styles from './results.module.css';
import { SlotDetails } from './SlotDetails';

type PickedSlotProps = {
  range: RangeSummary;
  total: number;
  timezone: string;
  /** Bumped on every add, so re-adding a time scrolls and flashes again. */
  seq: number;
  onPick: (range: SlotRange) => void;
  onRemove: () => void;
};

/** A time the organizer added from the heatmap, outside the listed options. */
export const PickedSlot = ({ range, total, timezone, seq, onPick, onRemove }: PickedSlotProps) => {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [flashedSeq, setFlashedSeq] = useState<number | null>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [seq]);

  return (
    <Section title={t.results.picked}>
      <div
        ref={ref}
        className={cx(styles.item, seq !== flashedSeq && styles.located)}
        onAnimationEnd={() => {
          setFlashedSeq(seq);
        }}
      >
        <SlotDetails
          label={formatRange(range, timezone, locale)}
          available={range.available}
          unavailable={range.unavailable}
          total={total}
        />
        <div className={styles.pickedActions}>
          <button
            type="button"
            className={styles.pickButton}
            onClick={() => {
              onPick({ start: range.start, end: range.end });
            }}
          >
            {t.schedule.formTitle}
          </button>
          <button type="button" className={styles.removeButton} onClick={onRemove}>
            {t.results.removePicked}
          </button>
        </div>
      </div>
    </Section>
  );
};
