'use client';

import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import type { Messages } from '@/i18n';

import { MainButton } from '../telegram/MainButton';
import { Button } from '../ui/Button';

type Status = 'idle' | 'saving' | 'saved' | 'error';

type SaveButtonProps = {
  /** Use Telegram's bottom button instead of an inline one. */
  native: boolean;
  status: Status;
  isDirty: boolean;
  onSave: () => void;
};

const labelFor = (t: Messages, status: Status, isDirty: boolean): string => {
  if (status === 'saving') return t.poll.saving;
  if (status === 'saved' && !isDirty) return t.poll.saved;
  return t.poll.save;
};

export const SaveButton = ({ native, status, isDirty, onSave }: SaveButtonProps) => {
  const { t } = useI18n();
  const webApp = useTelegram();
  const isDone = status === 'saved' && !isDirty;

  if (native) {
    // After saving, the bottom button turns into "Done — close" (the obvious next step).
    if (isDone && webApp) {
      return (
        <MainButton
          text={t.poll.close}
          onClick={() => {
            webApp.close();
          }}
        />
      );
    }
    return (
      <MainButton
        text={labelFor(t, status, isDirty)}
        onClick={onSave}
        disabled={!isDirty || status === 'saving'}
        loading={status === 'saving'}
      />
    );
  }

  return (
    <Button variant="secondary" disabled={!isDirty || status === 'saving'} onClick={onSave}>
      {labelFor(t, status, isDirty)}
    </Button>
  );
};
