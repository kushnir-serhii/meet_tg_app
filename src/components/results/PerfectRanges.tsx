import type { SlotRange } from '@/domain/types';
import { copy } from '@/shared/copy';
import { formatRange } from '@/shared/format';

import { Section } from '../ui/Section';
import styles from './results.module.css';

type PerfectRangesProps = {
  ranges: SlotRange[];
  timezone: string;
};

export const PerfectRanges = ({ ranges, timezone }: PerfectRangesProps) => (
  <Section title={copy.results.perfect}>
    <ul className={styles.list}>
      {ranges.map((range) => (
        <li key={range.start} className={styles.item}>
          {formatRange(range, timezone)}
        </li>
      ))}
    </ul>
  </Section>
);
