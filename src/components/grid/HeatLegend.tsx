import type { CSSProperties } from 'react';

import { useI18n } from '@/hooks/useI18n';
import { cx } from '@/utils/cx';

import styles from './grid.module.css';

const ITEMS = [
  { key: 'legendAll', className: styles.heatFull },
  { key: 'legendSome', className: styles.heat },
  { key: 'legendNone', className: styles.heatEmpty },
  { key: 'legendCreator', className: styles.legendOutline },
] as const;

/** Explains heatmap colours. */
export const HeatLegend = () => {
  const { t } = useI18n();

  return (
    <div className={styles.legend}>
      {ITEMS.map(({ key, className }) => (
        <span key={key} className={styles.legendItem}>
          <span
            className={cx(styles.legendSwatch, className)}
            style={key === 'legendSome' ? ({ '--ratio': 0.5 } as CSSProperties) : undefined}
            aria-hidden
          />
          {t.results[key]}
        </span>
      ))}
    </div>
  );
};
