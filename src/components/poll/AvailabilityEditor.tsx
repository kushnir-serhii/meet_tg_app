'use client';

import { type Ref, useCallback, useImperativeHandle, useMemo } from 'react';

import { buildGrid } from '@/domain/grid';
import type { Poll, PollDetails } from '@/domain/types';
import { type AutoSaveStatus, useAutoSave } from '@/hooks/useAutoSave';
import { useDragSelect } from '@/hooks/useDragSelect';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/useI18n';
import { useSlotSelection } from '@/hooks/useSlotSelection';
import type { Messages } from '@/i18n';

import { SelectCell } from '../grid/SelectCell';
import { SlotGrid } from '../grid/SlotGrid';
import { Hint, Section } from '../ui/Section';
import { EditorToolbar, type SaveLine } from './EditorToolbar';

/** Lets the screen make sure everything is saved (before Results, closing, sharing). */
export type AvailabilityEditorHandle = {
  flush: () => Promise<boolean>;
};

type AvailabilityEditorProps = {
  ref?: Ref<AvailabilityEditorHandle>;
  poll: Poll;
  initialSlots: string[];
  /** The user has a stored answer (an empty selection means "no answer"). */
  hasResponse: boolean;
  onSaved: (data: PollDetails) => void;
};

const saveLineFor = (
  t: Messages,
  status: AutoSaveStatus,
  hasResponse: boolean,
  retry: () => void,
): SaveLine | null => {
  if (status === 'pending' || status === 'saving') return { text: t.poll.stateSaving };
  if (status === 'error') return { text: t.poll.stateError, isError: true, onRetry: retry };
  if (hasResponse) return { text: t.poll.stateSaved };
  // Saved an empty selection in this session: the answer was withdrawn.
  if (status === 'saved') return { text: t.poll.stateRemoved };
  return null;
};

export const AvailabilityEditor = ({
  ref,
  poll,
  initialSlots,
  hasResponse,
  onSaved,
}: AvailabilityEditorProps) => {
  const { t, locale } = useI18n();
  const grid = useMemo(() => buildGrid(poll, locale), [poll, locale]);
  const { selected, setSlot, clear, undoClear, canUndoClear } = useSlotSelection(initialSlots);
  const { status, flush } = useAutoSave(poll.id, selected, initialSlots, onSaved);
  const haptics = useHaptics();

  useImperativeHandle(ref, () => ({ flush }), [flush]);

  const isSelected = useCallback((slot: string) => selected.has(slot), [selected]);
  const dragHandlers = useDragSelect({ isSelected, setSlot, onChange: haptics.selection });

  const renderCell = useCallback(
    (slot: string) => <SelectCell key={slot} slot={slot} selected={selected.has(slot)} />,
    [selected],
  );

  return (
    <Section>
      <Hint>{hasResponse ? t.poll.hintAutosave : t.poll.hint}</Hint>
      <EditorToolbar
        count={selected.size}
        saveLine={saveLineFor(t, status, hasResponse, () => void flush())}
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
    </Section>
  );
};
