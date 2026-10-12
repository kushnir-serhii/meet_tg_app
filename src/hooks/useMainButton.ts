'use client';

import { useEffect, useEffectEvent } from 'react';

import { useTelegram } from './useTelegram';

type MainButtonOptions = {
  text: string;
  onClick: () => void;
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

  useEffect(() => {
    if (!webApp) return;
    const button = webApp.MainButton;
    const listener = () => {
      handleClick();
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

    if (loading) button.showProgress(false);
    else button.hideProgress();
  }, [webApp, text, visible, disabled, loading]);
};
