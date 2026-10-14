'use client';

import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import type { Messages } from '@/i18n';

import { MainButton } from '../telegram/MainButton';
import { Button } from '../ui/Button';
import styles from './poll.module.css';

type Status = 'idle' | 'saving' | 'saved' | 'error';

type SaveButtonProps = {
  /** Use Telegram's bottom button instead of an inline one. */
  native: boolean;
  status: Status;
  isDirty: boolean;
  /** User already has a saved response (e.g. reopened the app) — nothing to save yet. */
  hasSaved: boolean;
  onSave: () => void;
};

const labelFor = (t: Messages, status: Status, isDone: boolean): string => {
  if (status === 'saving') return t.poll.saving;
  if (isDone) return t.poll.saved;
  return t.poll.save;
};

export const SaveButton = ({ native, status, isDirty, hasSaved, onSave }: SaveButtonProps) => {
  const { t } = useI18n();
  const webApp = useTelegram();
  const isDone = !isDirty && status !== 'saving' && (status === 'saved' || hasSaved);
  // Nothing to save: keep the button fully visible, just ignore taps (no faded "disabled" look).
  const inactive = !isDirty || status === 'saving';
  const handleSave = () => {
    if (!inactive) onSave();
  };

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
        text={labelFor(t, status, isDone)}
        onClick={handleSave}
        loading={status === 'saving'}
      />
    );
  }

  return (
    <Button
      variant="secondary"
      aria-disabled={inactive}
      className={isDone ? styles.saveDone : undefined}
      onClick={handleSave}
    >
      {labelFor(t, status, isDone)}
    </Button>
  );
};
