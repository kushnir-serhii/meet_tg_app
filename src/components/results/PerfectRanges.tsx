import { type CSSProperties, useMemo, useState } from 'react';

import { hasEnded, isPastDay } from '@/domain/pastTime';
import { groupRangesByDay } from '@/domain/ranges';
import type { Poll, SlotRange } from '@/domain/types';
import { useI18n } from '@/hooks/useI18n';
import { type LocateRequest, useLocateRange } from '@/hooks/useLocateRange';
import { formatGridDate, formatTime } from '@/shared/format';
import { cx } from '@/utils/cx';

import { Hint, Section } from '../ui/Section';
import styles from './results.module.css';
import { ShowAllButton } from './ShowAllButton';

type PerfectRangesProps = {
  poll: Poll;
  ranges: SlotRange[];
  /** Heatmap asked to show this slot's range: expand if hidden, scroll to it, flash it. */
  locate?: LocateRequest | null;
  /** Organizer can tap a range to schedule the meeting. */
  onPick?: (range: SlotRange) => void;
};

/**
 * Days as columns (like the grid), matching time ranges stacked under each day.
 * Past days and times are hidden until "Show all".
 */
export const PerfectRanges = ({ poll, ranges, locate = null, onPick }: PerfectRangesProps) => {
  const { t, locale } = useI18n();
  const [now] = useState(() => new Date());
  const [showAll, setShowAll] = useState(false);
  const upcoming = useMemo(() => ranges.filter((range) => !hasEnded(range, now)), [ranges, now]);
  const hiddenCount = ranges.length - upcoming.length;
  const { listRef, highlightedStart, onFlashEnd } = useLocateRange(ranges, locate, (range) => {
    if (!upcoming.includes(range)) setShowAll(true);
  });
  const days = useMemo(
    () =>
      showAll
        ? groupRangesByDay(ranges, poll.dates, poll.timezone)
        : groupRangesByDay(
            upcoming,
            poll.dates.filter((date) => !isPastDay(date, poll.timezone, now)),
            poll.timezone,
          ),
    [showAll, ranges, upcoming, poll.dates, poll.timezone, now],
  );

  return (
    <Section title={t.results.perfect}>
      {upcoming.length === 0 ? (
        <Hint>{t.results.allOptionsPast}</Hint>
      ) : (
        <Hint>{onPick ? t.schedule.pickHint : t.schedule.waitHint}</Hint>
      )}
      <div ref={listRef} className={styles.dayScroll}>
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
                      data-range={range.start}
                      onAnimationEnd={onFlashEnd}
                      type="button"
                      disabled={!pickable}
                      className={cx(
                        styles.timePill,
                        pickable && styles.timePillAction,
                        range.start === highlightedStart && styles.located,
                      )}
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
      {hiddenCount > 0 && (
        <ShowAllButton
          expanded={showAll}
          hiddenCount={hiddenCount}
          onToggle={() => {
            setShowAll((value) => !value);
          }}
        />
      )}
    </Section>
  );
};
