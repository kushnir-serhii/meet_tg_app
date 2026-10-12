import { type CSSProperties, memo } from 'react';

import { cx } from '@/utils/cx';

import styles from './grid.module.css';

type HeatCellProps = {
  slot: string;
  count: number;
  total: number;
  active: boolean;
  onSelect: (slot: string) => void;
};

/** Read-only cell coloured by how many people are free. */
export const HeatCell = memo(function HeatCell({
  slot,
  count,
  total,
  active,
  onSelect,
}: HeatCellProps) {
  const style = { '--ratio': total > 0 ? count / total : 0 } as CSSProperties;

  return (
    <button
      type="button"
      aria-label={`${slot}: ${count}/${total}`}
      className={cx(styles.cell, styles.heat, active && styles.active)}
      style={style}
      onClick={() => {
        onSelect(slot);
      }}
    />
  );
});
