import type { CSSProperties } from 'react';

import { useI18n } from '@/hooks/useI18n';
import { cx } from '@/utils/cx';

import styles from './grid.module.css';

const ITEMS = [
  { key: 'legendAll', className: styles.heatFull },
  { key: 'legendSome', className: styles.legendRamp },
  { key: 'legendCreator', className: cx(styles.heat, styles.heatCreator) },
  { key: 'legendNone', className: styles.heatEmpty },
] as const;

/** Explains heatmap colours: the green scale by count, and the organizer's dot. */
export const HeatLegend = () => {
  const { t } = useI18n();

  return (
    <div className={styles.legend}>
      {ITEMS.map(({ key, className }) => (
        <span key={key} className={styles.legendItem}>
          <span
            className={cx(styles.legendSwatch, className)}
            style={key === 'legendCreator' ? ({ '--ratio': 0.3 } as CSSProperties) : undefined}
            aria-hidden
          />
          {t.results[key]}
        </span>
      ))}
    </div>
  );
};
