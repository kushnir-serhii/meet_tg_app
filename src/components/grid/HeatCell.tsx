import { type CSSProperties, memo } from 'react';

import { cx } from '@/utils/cx';

import styles from './grid.module.css';

type HeatCellProps = {
  slot: string;
  count: number;
  total: number;
  /** The organizer marked this slot as available. */
  byCreator: boolean;
  active: boolean;
  onSelect: (slot: string) => void;
  /** Mouse hover or keyboard focus (desktop preview). */
  onPreview?: (slot: string, cell: HTMLElement) => void;
};

/** From this share of respondents the fill is dark enough for white digits. */
const STRONG_RATIO = 0.75;

/**
 * Read-only cell: the more respondents are free, the greener it is; solid with ✓ when everyone is.
 * Partial cells show the count (the total is in the "Responded" header); a dot marks the organizer.
 */
export const HeatCell = memo(function HeatCell({
  slot,
  count,
  total,
  byCreator,
  active,
  onSelect,
  onPreview,
}: HeatCellProps) {
  const ratio = total > 0 ? count / total : 0;
  const style = { '--ratio': ratio } as CSSProperties;
  const isFull = total > 0 && count === total;

  return (
    <button
      type="button"
      aria-label={`${slot}: ${count}/${total}`}
      className={cx(
        styles.cell,
        styles.heat,
        count === 0 && styles.heatEmpty,
        isFull && styles.heatFull,
        ratio >= STRONG_RATIO && styles.heatStrong,
        byCreator && !isFull && styles.heatCreator,
        active && styles.active,
      )}
      style={style}
      onClick={() => {
        onSelect(slot);
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') onPreview?.(slot, event.currentTarget);
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(':focus-visible')) onPreview?.(slot, event.currentTarget);
      }}
    >
      {count > 0 && !isFull ? count : null}
    </button>
  );
});
