'use client';

import { useEffect } from 'react';

import { isLocale, LOCALE_NAMES, LOCALES } from '@/i18n';
import { writeStoredLocale } from '@/lib/storedLocale';

import { useI18n } from './useI18n';
import { usePopup } from './usePopup';
import { useTelegram } from './useTelegram';

/** Adds "Settings" to Telegram's ⋮ menu (Bot API 7.0+); it opens a language picker. */
export const useLanguageMenu = () => {
  const webApp = useTelegram();
  const showPopup = usePopup();
  const { t, locale } = useI18n();

  useEffect(() => {
    const button = webApp?.isVersionAtLeast('7.0') ? webApp.SettingsButton : undefined;
    if (!button) return;

    const onClick = () => {
      void showPopup({
        title: t.language.title,
        message: t.language.message,
        buttons: LOCALES.map((id) => ({
          id,
          text: id === locale ? `✓ ${LOCALE_NAMES[id]}` : LOCALE_NAMES[id],
        })),
      }).then((id) => {
        if (isLocale(id) && id !== locale) writeStoredLocale(id);
      });
    };

    button.onClick(onClick).show();
    return () => {
      button.offClick(onClick).hide();
    };
  }, [webApp, showPopup, t, locale]);
};
