'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(hover: hover) and (pointer: fine)';

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => {
    media.removeEventListener('change', onChange);
  };
};

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/** True on a device with a mouse (desktop): hover can replace taps for previews. */
export const useCanHover = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
