import { useState } from 'react';

import { hasEnded } from '@/domain/pastTime';
import type { RangeSummary, SlotRange } from '@/domain/types';
import { useI18n } from '@/hooks/useI18n';
import { type LocateRequest, useLocateRange } from '@/hooks/useLocateRange';
import { formatRange } from '@/shared/format';
import { cx } from '@/utils/cx';

import { Hint, Section } from '../ui/Section';
import styles from './results.module.css';
import { ShowAllButton } from './ShowAllButton';
import { SlotDetails } from './SlotDetails';

type BestSlotsProps = {
  ranges: RangeSummary[];
  count: number;
  total: number;
  timezone: string;
  /** Heatmap asked to show this slot's range: expand if hidden, scroll to it, flash it. */
  locate?: LocateRequest | null;
  /** Organizer can schedule the meeting from a range. */
  onPick?: (range: SlotRange) => void;
};

/** Upcoming options shown before "Show all". */
const VISIBLE_COUNT = 3;

/**
 * Shown when nobody-fits-all: every range where the most people are free.
 * Only the first few upcoming ranges are shown; the rest and past ones are behind "Show all".
 */
export const BestSlots = ({
  ranges,
  count,
  total,
  timezone,
  locate = null,
  onPick,
}: BestSlotsProps) => {
  const { t, locale } = useI18n();
  const [now] = useState(() => new Date());
  const [showAll, setShowAll] = useState(false);
  const upcoming = ranges.filter((range) => !hasEnded(range, now)).slice(0, VISIBLE_COUNT);
  const shown = showAll ? ranges : upcoming;
  const hiddenCount = ranges.length - upcoming.length;
  const { listRef, highlightedStart, onFlashEnd } = useLocateRange<RangeSummary, HTMLUListElement>(
    ranges,
    locate,
    (range) => {
      if (!upcoming.includes(range)) setShowAll(true);
    },
  );

  return (
    <Section title={t.results.best(count, total)}>
      <Hint>{t.results.noMatch}</Hint>
      {upcoming.length === 0 ? (
        <Hint>{t.results.allOptionsPast}</Hint>
      ) : (
        <Hint>{onPick ? t.schedule.pickHint : t.schedule.waitHint}</Hint>
      )}
      <ul ref={listRef} className={styles.list}>
        {shown.map((range) => {
          const ended = hasEnded(range, now);
          return (
            <li
              key={range.start}
              data-range={range.start}
              onAnimationEnd={onFlashEnd}
              className={cx(
                styles.item,
                ended && styles.itemPast,
                range.start === highlightedStart && styles.located,
              )}
            >
              <SlotDetails
                label={formatRange(range, timezone, locale)}
                available={range.available}
                unavailable={range.unavailable}
                total={total}
              />
              {onPick && !ended && (
                <button
                  type="button"
                  className={styles.pickButton}
                  onClick={() => {
                    onPick({ start: range.start, end: range.end });
                  }}
                >
                  {t.schedule.formTitle}
                </button>
              )}
            </li>
          );
        })}
      </ul>
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
