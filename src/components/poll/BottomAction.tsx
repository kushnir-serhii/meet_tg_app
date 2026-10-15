'use client';

import { useState } from 'react';

import { useTelegram } from '@/hooks/useTelegram';

import { MainButton } from '../telegram/MainButton';
import { Button } from '../ui/Button';

/** The screen's one primary action, e.g. "Send to chat" or "Done". */
export type PrimaryAction = {
  text: string;
  run: () => Promise<void> | void;
};

type BottomActionProps = {
  text: string;
  onPress: () => Promise<void>;
};

/**
 * Telegram's bottom button; shows "Please wait…" while the action runs (ignores repeated taps).
 * Outside Telegram (dev in a browser) — an inline button.
 */
export const BottomAction = ({ text, onPress }: BottomActionProps) => {
  const webApp = useTelegram();
  const [busy, setBusy] = useState(false);

  const handlePress = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onPress();
    } finally {
      setBusy(false);
    }
  };

  if (webApp) {
    return <MainButton text={text} loading={busy} onClick={() => void handlePress()} />;
  }
  return (
    <Button loading={busy} onClick={() => void handlePress()}>
      {text}
    </Button>
  );
};
