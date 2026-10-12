import { memo } from 'react';

import { cx } from '@/utils/cx';

import styles from './grid.module.css';

type SelectCellProps = {
  slot: string;
  selected: boolean;
};

/** Cell picked up by `useDragSelect` through `data-slot`. */
export const SelectCell = memo(function SelectCell({ slot, selected }: SelectCellProps) {
  return (
    <div
      data-slot={slot}
      role="checkbox"
      aria-checked={selected}
      aria-label={slot}
      className={cx(styles.cell, styles.selectable, selected && styles.selected)}
    />
  );
});
