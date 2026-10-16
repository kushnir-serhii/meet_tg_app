'use client';

import { useState } from 'react';

import { Button } from './Button';
import styles from './ui.module.css';

type BottomButtonProps = {
  text: string;
  /** May be async: the button shows the spinner until it settles and ignores repeated taps. */
  onPress: () => Promise<void> | void;
  loading?: boolean;
  disabled?: boolean;
};

/** The screen's primary action, pinned to the bottom. Same `Button` (and spinner) as everywhere else. */
export const BottomButton = ({ text, onPress, loading = false, disabled }: BottomButtonProps) => {
  const [running, setRunning] = useState(false);
  const busy = loading || running;

  const handlePress = async () => {
    if (busy) return;
    setRunning(true);
    try {
      await onPress();
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className={styles.bottomBar}>
      <Button loading={busy} disabled={disabled} onClick={() => void handlePress()}>
        {text}
      </Button>
    </div>
  );
};
