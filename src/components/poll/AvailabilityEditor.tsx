'use client';

import { type Ref, useCallback, useEffect, useImperativeHandle, useMemo } from 'react';

import { buildGrid } from '@/domain/grid';
import type { Poll, PollDetails } from '@/domain/types';
import { useDragSelect } from '@/hooks/useDragSelect';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/useI18n';
import { useSaveAvailability } from '@/hooks/useSaveAvailability';
import { useSlotSelection } from '@/hooks/useSlotSelection';

import { SelectCell } from '../grid/SelectCell';
import { SlotGrid } from '../grid/SlotGrid';
import { ErrorText, Hint, Section } from '../ui/Section';
import { EditorToolbar } from './EditorToolbar';
import { type IdleAction, SaveButton } from './SaveButton';
import { SavedNotice } from './SavedNotice';

/** Lets the screen save or drop unsaved edits (e.g. before leaving to Results). */
export type AvailabilityEditorHandle = {
  save: () => Promise<boolean>;
  discard: () => void;
};

type AvailabilityEditorProps = {
  ref?: Ref<AvailabilityEditorHandle>;
  poll: Poll;
  initialSlots: string[];
  /** The user already has a stored response (possibly from an earlier session). */
  hasResponse: boolean;
  /** Bottom-button action when nothing is unsaved (organizer: "Send to chat"). */
  idleAction?: IdleAction;
  onSaved: (data: PollDetails) => void;
  onDirtyChange: (isDirty: boolean) => void;
  onShowResults: () => void;
};

export const AvailabilityEditor = ({
  ref,
  poll,
  initialSlots,
  hasResponse,
  idleAction,
  onSaved,
  onDirtyChange,
  onShowResults,
}: AvailabilityEditorProps) => {
  const { t, locale } = useI18n();
  const grid = useMemo(() => buildGrid(poll, locale), [poll, locale]);
  const { selected, setSlot, markSaved, reset, clear, undoClear, canUndoClear, isDirty } =
    useSlotSelection(initialSlots);
  const haptics = useHaptics();

  const handleSaved = useCallback(
    (data: PollDetails) => {
      markSaved(data.myResponse?.slots ?? []);
      onSaved(data);
    },
    [markSaved, onSaved],
  );
  const { save, status } = useSaveAvailability(poll.id, handleSaved);
  /** Pending save would remove the answer (everything cleared). */
  const willWithdraw = isDirty && selected.size === 0 && hasResponse;
  /** Just saved an empty selection — the answer is gone, not "saved". */
  const isWithdrawn = status === 'saved' && !isDirty && !hasResponse;
  let saveState: 'saved' | 'unsaved' | null = null;
  if (isDirty) saveState = 'unsaved';
  else if (hasResponse) saveState = 'saved';

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useImperativeHandle(ref, () => ({ save: () => save([...selected]), discard: reset }), [
    save,
    selected,
    reset,
  ]);

  const isSelected = useCallback((slot: string) => selected.has(slot), [selected]);
  const dragHandlers = useDragSelect({ isSelected, setSlot, onChange: haptics.selection });

  const renderCell = useCallback(
    (slot: string) => <SelectCell key={slot} slot={slot} selected={selected.has(slot)} />,
    [selected],
  );

  return (
    <Section>
      <Hint>{t.poll.hint}</Hint>
      <EditorToolbar
        count={selected.size}
        saveState={status === 'saving' ? null : saveState}
        canUndo={canUndoClear}
        onClear={() => {
          clear();
          haptics.selection();
        }}
        onUndo={() => {
          undoClear();
          haptics.selection();
        }}
      />
      <SlotGrid grid={grid} renderCell={renderCell} bodyProps={dragHandlers} />
      {status === 'error' && <ErrorText>{t.app.genericError}</ErrorText>}
      {status === 'saved' && !isDirty && (
        <SavedNotice
          beforeShare={idleAction != null}
          autoScroll
          withdrawn={isWithdrawn}
          onShowResults={onShowResults}
        />
      )}
      <SaveButton
        idleAction={idleAction}
        status={status}
        isDirty={isDirty}
        hasSaved={hasResponse || isWithdrawn}
        saveText={willWithdraw ? t.poll.withdraw : undefined}
        onSave={() => void save([...selected])}
      />
    </Section>
  );
};
