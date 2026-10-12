import type { Poll } from '@/domain/types';
import { copy } from '@/shared/copy';

import { Hint } from '../ui/Section';
import styles from './poll.module.css';

const viewerTimezone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const PollHeader = ({ poll }: { poll: Poll }) => {
  const tz = viewerTimezone();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{poll.title}</h1>
      <Hint>{copy.poll.timezone(poll.timezone)}</Hint>
      {tz !== poll.timezone && <Hint>{copy.poll.timezoneMismatch(tz)}</Hint>}
    </header>
  );
};
