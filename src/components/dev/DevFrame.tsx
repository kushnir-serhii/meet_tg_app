import type { ReactNode } from 'react';

import styles from './dev.module.css';

export type DevTheme = 'light' | 'dark';

/**
 * Telegram's own palettes. Set on the app tokens directly: the `--tg-theme-*` fallbacks in
 * globals.css are resolved on :root, so overriding them on a child would have no effect.
 */
const THEMES: Record<DevTheme, Record<string, string>> = {
  light: {
    '--bg': '#ffffff',
    '--bg-secondary': '#f1f1f4',
    '--text': '#111111',
    '--hint': '#8a8a93',
    '--link': '#2481cc',
    '--accent': '#2481cc',
    '--accent-text': '#ffffff',
    '--section-bg': '#ffffff',
    '--destructive': '#e53935',
  },
  dark: {
    '--bg': '#17212b',
    '--bg-secondary': '#0e1621',
    '--text': '#f5f5f5',
    '--hint': '#708499',
    '--link': '#6ab3f3',
    '--accent': '#5288c1',
    '--accent-text': '#ffffff',
    '--section-bg': '#17212b',
    '--destructive': '#ec3942',
  },
};

type DevFrameProps = {
  theme: DevTheme;
  width: number;
  /** Fixed height: needed for demos with overlays (sheet, bottom bar), which fill the frame. */
  height?: number;
  children: ReactNode;
};

/** A phone-sized app screen. `transform` makes `position: fixed` children stay inside it. */
export const DevFrame = ({ theme, width, height, children }: DevFrameProps) => (
  <div className={styles.frameWrap}>
    <span className={styles.frameLabel}>{theme}</span>
    <div className={styles.frame} style={{ ...THEMES[theme], width, height }}>
      <div className={styles.screen}>{children}</div>
    </div>
  </div>
);
