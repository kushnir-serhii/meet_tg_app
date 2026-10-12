import type { Poll } from '@/domain/types';
import { useI18n } from '@/hooks/useI18n';

import { Hint } from '../ui/Section';
import styles from './poll.module.css';

const viewerTimezone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const PollHeader = ({ poll }: { poll: Poll }) => {
  const { t } = useI18n();
  const tz = viewerTimezone();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{poll.title}</h1>
      <Hint>{t.poll.timezone(poll.timezone)}</Hint>
      {tz !== poll.timezone && <Hint>{t.poll.timezoneMismatch(tz)}</Hint>}
    </header>
  );
};
