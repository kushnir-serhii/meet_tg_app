'use client';

import { useContext } from 'react';

import { I18nContext, type I18nValue } from '@/i18n/I18nProvider';

/** Current locale and its messages: `const { t, locale } = useI18n()`. */
export const useI18n = (): I18nValue => useContext(I18nContext);
