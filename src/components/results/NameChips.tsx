import type { Participant } from '@/domain/types';
import { cx } from '@/utils/cx';

import styles from './results.module.css';

type NameChipsProps = {
  people: Participant[];
  muted?: boolean;
};

export const NameChips = ({ people, muted = false }: NameChipsProps) => (
  <ul className={styles.chips}>
    {people.map((person) => (
      <li key={person.userId} className={cx(styles.chip, muted && styles.chipMuted)}>
        {person.name}
      </li>
    ))}
  </ul>
);
