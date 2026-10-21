'use client';

import { useState } from 'react';

import { I18nProvider } from '@/i18n/I18nProvider';
import { type Locale, LOCALES } from '@/i18n/types';

import { DEMOS } from './demos';
import styles from './dev.module.css';
import { DevFrame, type DevTheme } from './DevFrame';

const THEME_MODES = ['both', 'light', 'dark'] as const;
type ThemeMode = (typeof THEME_MODES)[number];

/** Phone (Telegram mobile) and the app's max content width (Telegram desktop). */
const WIDTHS = [390, 672] as const;

type ToggleProps<T extends string | number> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

const Toggle = <T extends string | number>({ label, options, value, onChange }: ToggleProps<T>) => (
  <span className={styles.toggle}>
    {label}
    {options.map((option) => (
      <button
        key={option}
        type="button"
        aria-pressed={option === value}
        onClick={() => {
          onChange(option);
        }}
      >
        {option}
      </button>
    ))}
  </span>
);

/** Dev-only page: every screen-level component, side by side in light and dark. */
export const ComponentGallery = () => {
  const [locale, setLocale] = useState<Locale>('uk');
  const [mode, setMode] = useState<ThemeMode>('both');
  const [width, setWidth] = useState<number>(WIDTHS[0]);
  const themes: DevTheme[] = mode === 'both' ? ['light', 'dark'] : [mode];

  return (
    <I18nProvider locale={locale}>
      <div className={styles.page}>
        <header className={styles.toolbar}>
          <span className={styles.toolbarTitle}>Pick to Meet — components (dev)</span>
          <Toggle label="Theme" options={THEME_MODES} value={mode} onChange={setMode} />
          <Toggle label="Width" options={WIDTHS} value={width} onChange={setWidth} />
          <Toggle label="Language" options={LOCALES} value={locale} onChange={setLocale} />
        </header>
        <nav className={styles.nav}>
          {DEMOS.map((demo) => (
            <a key={demo.id} href={`#${demo.id}`}>
              {demo.title}
            </a>
          ))}
        </nav>
        {DEMOS.map((demo) => (
          <section key={demo.id} id={demo.id} className={styles.demo}>
            <h2 className={styles.demoTitle}>{demo.title}</h2>
            {demo.note && <p className={styles.demoNote}>{demo.note}</p>}
            <div className={styles.frames}>
              {themes.map((theme) => (
                <DevFrame key={theme} theme={theme} width={width} height={demo.height}>
                  {demo.render()}
                </DevFrame>
              ))}
            </div>
          </section>
        ))}
      </div>
    </I18nProvider>
  );
};
