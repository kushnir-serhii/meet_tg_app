'use client';

import { useMainButton } from '@/hooks/useMainButton';

type MainButtonProps = Parameters<typeof useMainButton>[0];

/** Declarative wrapper: mount it to show Telegram's bottom button, unmount to hide. */
export const MainButton = (props: MainButtonProps) => {
  useMainButton(props);
  return null;
};
