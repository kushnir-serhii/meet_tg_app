'use client';

import { useCallback, useMemo } from 'react';

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
  useNativeButton: boolean;
  /** Saved earlier in this session (editor was remounted, e.g. after a tab switch). */
  alreadySaved: boolean;
  onSaved: (data: PollDetails) => void;
  onShowResults: () => void;
};

export const AvailabilityEditor = ({
  poll,
  initialSlots,
  useNativeButton,
  alreadySaved,
  onSaved,
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
  const { save, status: saveStatus } = useSaveAvailability(poll.id, handleSaved);
  // A fresh mount starts 'idle'; restore 'saved' if nothing changed since the last save.
  const status = saveStatus === 'idle' && alreadySaved ? 'saved' : saveStatus;

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
          beforeShare={!useNativeButton}
          autoScroll={saveStatus === 'saved'}
          onShowResults={onShowResults}
        />
      )}
      <SaveButton
        native={useNativeButton}
        status={status}
        isDirty={isDirty}
        hasSaved={initialSlots.length > 0}
        onSave={() => void save([...selected])}
      />
    </Section>
  );
};
