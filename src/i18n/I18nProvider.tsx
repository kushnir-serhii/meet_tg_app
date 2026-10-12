'use client';

import { createContext, type ReactNode, useMemo } from 'react';

import { DEFAULT_LOCALE, getMessages, type Locale, type Messages } from '.';

export type I18nValue = { locale: Locale; t: Messages };

export const I18nContext = createContext<I18nValue>({
  locale: DEFAULT_LOCALE,
  t: getMessages(DEFAULT_LOCALE),
});

type I18nProviderProps = { locale: Locale; children: ReactNode };

export const I18nProvider = ({ locale, children }: I18nProviderProps) => {
  const value = useMemo(() => ({ locale, t: getMessages(locale) }), [locale]);
  return <I18nContext value={value}>{children}</I18nContext>;
};
