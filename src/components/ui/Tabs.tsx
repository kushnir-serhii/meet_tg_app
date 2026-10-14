import { cx } from '@/utils/cx';

import styles from './ui.module.css';

type Tab<T extends string> = {
  id: T;
  label: string;
  /** Looks unavailable but stays tappable, so the screen can explain why. */
  locked?: boolean;
};

type TabsProps<T extends string> = {
  tabs: readonly Tab<T>[];
  active: T;
  onChange: (id: T) => void;
};

export const Tabs = <T extends string>({ tabs, active, onChange }: TabsProps<T>) => (
  <div className={styles.tabs} role="tablist">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={tab.id === active}
        aria-disabled={tab.locked}
        className={cx(
          styles.tab,
          tab.id === active && styles.tabActive,
          tab.locked && styles.tabLocked,
        )}
        onClick={() => {
          onChange(tab.id);
        }}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
