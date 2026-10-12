'use client';

import { copy } from '@/shared/copy';

import { MainButton } from '../telegram/MainButton';
import { Button } from '../ui/Button';

type SaveButtonProps = {
  /** Use Telegram's bottom button instead of an inline one. */
  native: boolean;
  status: 'idle' | 'saving' | 'saved' | 'error';
  isDirty: boolean;
  onSave: () => void;
};

const labelFor = (status: SaveButtonProps['status'], isDirty: boolean): string => {
  if (status === 'saving') return copy.poll.saving;
  if (status === 'saved' && !isDirty) return copy.poll.saved;
  return copy.poll.save;
};

export const SaveButton = ({ native, status, isDirty, onSave }: SaveButtonProps) => {
  const text = labelFor(status, isDirty);
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
