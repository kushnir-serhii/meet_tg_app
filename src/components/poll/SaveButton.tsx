'use client';

import { useI18n } from '@/hooks/useI18n';
import type { Messages } from '@/i18n';

import { MainButton } from '../telegram/MainButton';
import { Button } from '../ui/Button';

type SaveButtonProps = {
  /** Use Telegram's bottom button instead of an inline one. */
  native: boolean;
  status: 'idle' | 'saving' | 'saved' | 'error';
  isDirty: boolean;
  onSave: () => void;
};

const labelFor = (t: Messages, status: SaveButtonProps['status'], isDirty: boolean): string => {
  if (status === 'saving') return t.poll.saving;
  if (status === 'saved' && !isDirty) return t.poll.saved;
  return t.poll.save;
};

export const SaveButton = ({ native, status, isDirty, onSave }: SaveButtonProps) => {
  const { t } = useI18n();
  const text = labelFor(t, status, isDirty);
  const disabled = !isDirty || status === 'saving';

  if (native) {
    return (
      <MainButton text={text} onClick={onSave} disabled={disabled} loading={status === 'saving'} />
    );
  }

  return (
    <Button variant="secondary" disabled={disabled} onClick={onSave}>
      {text}
    </Button>
  );
};
