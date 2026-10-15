'use client';

import { useEffect, useEffectEvent, useState } from 'react';

import { useTelegram } from './useTelegram';

type MainButtonOptions = {
  text: string;
  /** May be async: the button shows Telegram's progress spinner until it settles. */
  onClick: () => Promise<void> | void;
  visible?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

/** Binds Telegram's native bottom button to React state. */
export const useMainButton = ({
  text,
  onClick,
  visible = true,
  disabled = false,
  loading = false,
}: MainButtonOptions): void => {
  const webApp = useTelegram();
  const handleClick = useEffectEvent(onClick);
  const [running, setRunning] = useState(false);

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
    const button = webApp.MainButton.setText(text);

    if (visible) button.show();
    else button.hide();

    if (disabled) button.disable();
    else button.enable();

    if (loading || running) button.showProgress(false);
    else button.hideProgress();
  }, [webApp, text, visible, disabled, loading, running]);
};
