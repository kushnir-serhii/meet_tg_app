import type { SlotSummary } from '@/domain/types';
import { copy } from '@/shared/copy';

import { Hint, Section } from '../ui/Section';
import styles from './results.module.css';
import { SlotDetails } from './SlotDetails';

type BestSlotsProps = {
  best: SlotSummary[];
  total: number;
  timezone: string;
};

export const BestSlots = ({ best, total, timezone }: BestSlotsProps) => (
  <Section title={copy.results.best}>
    <Hint>{copy.results.noMatch}</Hint>
    <ul className={styles.list}>
      {best.map((summary) => (
        <li key={summary.slot} className={styles.item}>
          <SlotDetails summary={summary} total={total} timezone={timezone} />
        </li>
      ))}
    </ul>
  </Section>
);
