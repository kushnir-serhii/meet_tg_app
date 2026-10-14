'use client';

import { useCallback } from 'react';

import { useI18n } from './useI18n';
import { usePopup } from './usePopup';

type ConfirmOptions = {
  /** Label of the confirming button — name the action ("Видалити"), not "OK". */
  confirmText: string;
  destructive?: boolean;
};

/** Confirm dialog as a promise: true only when the action button was pressed. */
export const useConfirm = () => {
  const popup = usePopup();
  const { t } = useI18n();

  return useCallback(
    async (message: string, { confirmText, destructive = false }: ConfirmOptions) =>
      (await popup({
        message,
        buttons: [
          { id: 'cancel', type: 'default', text: t.common.cancel },
          { id: 'confirm', type: destructive ? 'destructive' : 'default', text: confirmText },
        ],
      })) === 'confirm',
    [popup, t],
  );
};
