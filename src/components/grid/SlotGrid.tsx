import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import type { GridModel } from '@/domain/grid';

import styles from './grid.module.css';

type SlotGridProps = {
  grid: GridModel;
  renderCell: (slot: string) => ReactNode;
  /** Pointer handlers etc. applied to the cells area. */
  bodyProps?: HTMLAttributes<HTMLDivElement>;
};

/** Layout-only "days × time" grid; cells are rendered by the caller. */
export const SlotGrid = ({ grid, renderCell, bodyProps }: SlotGridProps) => {
  const style = { '--days': grid.days.length } as CSSProperties;

  return (
    <div className={styles.scroll}>
      <div className={styles.grid} style={style}>
        <div className={styles.corner} />
        {grid.days.map((day) => (
          <div key={day.date} className={styles.dayLabel}>
            {day.label}
          </div>
        ))}
        <div className={styles.body} {...bodyProps}>
          {grid.rows.map((row) => (
            <div key={row.minute} className={styles.row}>
              <div className={styles.timeLabel}>{row.label}</div>
              {row.slots.map(renderCell)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
