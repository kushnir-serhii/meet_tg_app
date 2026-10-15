'use client';

import { useEffect, useEffectEvent, useState } from 'react';

import { useBusyText } from './useBusyText';
import { useTelegram } from './useTelegram';

type MainButtonOptions = {
  text: string;
  /** May be async: the button shows a "Please wait…" label until it settles. */
  onClick: () => Promise<void> | void;
  visible?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
};

/** Binds Telegram's native bottom button to React state. */
export const useMainButton = ({
  text,
  onClick,
  visible = true,
  disabled = false,
  loading = false,
  loadingText,
}: MainButtonOptions): void => {
  const webApp = useTelegram();
  const handleClick = useEffectEvent(onClick);
  const [running, setRunning] = useState(false);
  const busy = loading || running;
  const label = useBusyText(text, busy, loadingText);

  useEffect(() => {
    if (!webApp) return;
    const button = webApp.MainButton;
    const listener = () => {
      const result = handleClick();
      if (!result) return;
      setRunning(true);
      void Promise.resolve(result)
        .catch(() => undefined)
        .finally(() => {
          setRunning(false);
        });
    };

    button.onClick(listener);
    return () => {
      button.offClick(listener);
      button.hide();
    };
  }, [webApp]);

  useEffect(() => {
    if (!webApp) return;
    // Never Telegram's spinner: the label itself says the action is running.
    const button = webApp.MainButton.setText(label);
    button.hideProgress();

    if (visible) button.show();
    else button.hide();

    if (disabled || busy) button.disable();
    else button.enable();
  }, [webApp, label, visible, disabled, busy]);
};
