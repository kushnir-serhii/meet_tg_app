import { type CSSProperties, useMemo, useState } from 'react';

import { hasEnded } from '@/domain/pastTime';
import { groupRangesByDay } from '@/domain/ranges';
import type { Poll, SlotRange } from '@/domain/types';
import { useI18n } from '@/hooks/useI18n';
import { formatGridDate, formatTime } from '@/shared/format';
import { cx } from '@/utils/cx';

import { Hint, Section } from '../ui/Section';
import styles from './results.module.css';

type PerfectRangesProps = {
  poll: Poll;
  ranges: SlotRange[];
  /** Organizer can tap a range to schedule the meeting. */
  onPick?: (range: SlotRange) => void;
};

/** Days as columns (like the grid), matching time ranges stacked under each day. */
export const PerfectRanges = ({ poll, ranges, onPick }: PerfectRangesProps) => {
  const { t, locale } = useI18n();
  const [now] = useState(() => new Date());
  const days = useMemo(
    () => groupRangesByDay(ranges, poll.dates, poll.timezone),
    [ranges, poll.dates, poll.timezone],
  );

  return (
    <Section title={t.results.perfect}>
      <Hint>{onPick ? t.schedule.pickHint : t.schedule.waitHint}</Hint>
      <div className={styles.dayScroll}>
        <ul className={styles.dayColumns} style={{ '--days': days.length } as CSSProperties}>
          {days.map(({ date, ranges: dayRanges }) => {
            const { weekday, day } = formatGridDate(date, locale);
            return (
              <li key={date} className={styles.dayColumn}>
                <div className={styles.dayHead}>
                  <span className={styles.dayWeekday}>{weekday}</span>
                  <span>{day}</span>
                </div>
                {dayRanges.length === 0 && <span className={styles.dayEmpty}>—</span>}
                {dayRanges.map((range) => {
                  const pickable = onPick !== undefined && !hasEnded(range, now);
                  return (
                    <button
                      key={range.start}
                      type="button"
                      disabled={!pickable}
                      className={cx(styles.timePill, pickable && styles.timePillAction)}
                      onClick={() => onPick?.(range)}
                    >
                      <span className={styles.timeStart}>
                        {formatTime(range.start, poll.timezone)}
                      </span>
                      <span className={styles.timeEnd}>{formatTime(range.end, poll.timezone)}</span>
                    </button>
                  );
                })}
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
};
