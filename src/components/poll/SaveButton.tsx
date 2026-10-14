'use client';

import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';

import { MainButton } from '../telegram/MainButton';
import { Button } from '../ui/Button';
import styles from './poll.module.css';

type Status = 'idle' | 'saving' | 'saved' | 'error';

/** What the bottom button does when there's nothing to save (e.g. "Send to chat"). */
export type IdleAction = { text: string; onClick: () => void };

type SaveButtonProps = {
  status: Status;
  isDirty: boolean;
  /** A response is stored (this session or earlier) — unchanged selection means "done". */
  hasSaved: boolean;
  /** Replaces "Done — close" while the selection is saved / untouched. */
  idleAction?: IdleAction;
  /** Overrides "Save" (e.g. "Remove my answer" when everything was cleared). */
  saveText?: string;
  onSave: () => void;
};

/**
 * The one primary action of the screen, on Telegram's bottom button:
 * unsaved edits → "Save"; otherwise the idle action ("Send to chat") or "Done" (close).
 * Outside Telegram (dev in a browser) falls back to an inline button.
 */
export const SaveButton = ({
  status,
  isDirty,
  hasSaved,
  idleAction,
  saveText,
  onSave,
}: SaveButtonProps) => {
  const { t } = useI18n();
  const webApp = useTelegram();
  const haptics = useHaptics();
  const isSaving = status === 'saving';
  const isDone = !isDirty && !isSaving && (status === 'saved' || hasSaved);

  const handleSave = () => {
    if (isSaving) return;
    // Nothing selected yet: a tap still gets feedback instead of silently doing nothing.
    if (!isDirty) {
      haptics.warning();
      return;
    }
    onSave();
  };

  let text = saveText ?? t.poll.save;
  let onClick = handleSave;
  if (isSaving) text = t.poll.saving;
  else if (!isDirty && idleAction) ({ text, onClick } = idleAction);
  else if (isDone) {
    text = t.poll.close;
    onClick = () => webApp?.close();
  }

  if (webApp) return <MainButton text={text} onClick={onClick} loading={isSaving} />;

  return (
    <Button variant="secondary" className={isDone ? styles.saveDone : undefined} onClick={onClick}>
      {text}
    </Button>
  );
};
