import type { SlotRange } from '@/domain/types';
import { useI18n } from '@/hooks/useI18n';
import { formatRange } from '@/shared/format';

import { Section } from '../ui/Section';
import styles from './results.module.css';

type PerfectRangesProps = {
  ranges: SlotRange[];
  timezone: string;
};

export const PerfectRanges = ({ ranges, timezone }: PerfectRangesProps) => {
  const { t, locale } = useI18n();

  return (
    <Section title={t.results.perfect}>
      <ul className={styles.list}>
        {ranges.map((range) => (
          <li key={range.start} className={styles.item}>
            {formatRange(range, timezone, locale)}
          </li>
        ))}
      </ul>
    </Section>
  );
};
