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
import { SaveButton } from './SaveButton';

type AvailabilityEditorProps = {
  poll: Poll;
  initialSlots: string[];
  useNativeButton: boolean;
  onSaved: (data: PollDetails) => void;
};

export const AvailabilityEditor = ({
  poll,
  initialSlots,
  useNativeButton,
  onSaved,
}: AvailabilityEditorProps) => {
  const { t, locale } = useI18n();
  const grid = useMemo(() => buildGrid(poll, locale), [poll, locale]);
  const { selected, setSlot, markSaved, isDirty } = useSlotSelection(initialSlots);
  const haptics = useHaptics();

  const handleSaved = useCallback(
    (data: PollDetails) => {
      markSaved(data.myResponse?.slots ?? []);
      onSaved(data);
    },
    [markSaved, onSaved],
  );
  const { save, status } = useSaveAvailability(poll.id, handleSaved);

  const isSelected = useCallback((slot: string) => selected.has(slot), [selected]);
  const dragHandlers = useDragSelect({ isSelected, setSlot, onChange: haptics.selection });

  const renderCell = useCallback(
    (slot: string) => <SelectCell key={slot} slot={slot} selected={selected.has(slot)} />,
    [selected],
  );

  return (
    <Section>
      <Hint>{t.poll.hint}</Hint>
      <SlotGrid grid={grid} renderCell={renderCell} bodyProps={dragHandlers} />
      {status === 'error' && <ErrorText>{t.app.genericError}</ErrorText>}
      <SaveButton
        native={useNativeButton}
        status={status}
        isDirty={isDirty}
        onSave={() => void save([...selected])}
      />
    </Section>
  );
};
