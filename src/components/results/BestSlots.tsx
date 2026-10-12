import type { RangeSummary } from '@/domain/types';
import { useI18n } from '@/hooks/useI18n';
import { formatRange } from '@/shared/format';

import { Hint, Section } from '../ui/Section';
import styles from './results.module.css';
import { SlotDetails } from './SlotDetails';

type BestSlotsProps = {
  ranges: RangeSummary[];
  count: number;
  total: number;
  timezone: string;
};

/** Shown when nobody-fits-all: every range where the most people are free. */
export const BestSlots = ({ ranges, count, total, timezone }: BestSlotsProps) => {
  const { t, locale } = useI18n();

  return (
    <Section title={t.results.best(count, total)}>
      <Hint>{t.results.noMatch}</Hint>
      <ul className={styles.list}>
        {ranges.map((range) => (
          <li key={range.start} className={styles.item}>
            <SlotDetails
              label={formatRange(range, timezone, locale)}
              available={range.available}
              unavailable={range.unavailable}
              total={total}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
};
