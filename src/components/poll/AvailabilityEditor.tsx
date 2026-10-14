'use client';

import { useCallback, useEffect, useMemo } from 'react';

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
import { SaveButton } from './SaveButton';
import { SavedNotice } from './SavedNotice';

type AvailabilityEditorProps = {
  poll: Poll;
  initialSlots: string[];
  /** The user already has a stored response (possibly from an earlier session). */
  hasResponse: boolean;
  useNativeButton: boolean;
  onSaved: (data: PollDetails) => void;
  onDirtyChange: (isDirty: boolean) => void;
  onShowResults: () => void;
};

export const AvailabilityEditor = ({
  poll,
  initialSlots,
  hasResponse,
  useNativeButton,
  onSaved,
  onDirtyChange,
  onShowResults,
}: AvailabilityEditorProps) => {
  const { t, locale } = useI18n();
  const grid = useMemo(() => buildGrid(poll, locale), [poll, locale]);
  const { selected, setSlot, markSaved, clear, undoClear, canUndoClear, isDirty } =
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
  const isStored = hasResponse || status === 'saved';
  let saveState: 'saved' | 'unsaved' | null = null;
  if (isDirty) saveState = 'unsaved';
  else if (isStored) saveState = 'saved';

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

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
        <SavedNotice beforeShare={!useNativeButton} autoScroll onShowResults={onShowResults} />
      )}
      <SaveButton
        native={useNativeButton}
        status={status}
        isDirty={isDirty}
        hasSaved={isStored}
        onSave={() => void save([...selected])}
      />
    </Section>
  );
};
