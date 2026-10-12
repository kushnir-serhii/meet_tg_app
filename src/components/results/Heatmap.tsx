'use client';

import { useCallback, useMemo, useState } from 'react';

import { buildGrid } from '@/domain/grid';
import { getSlotSummary } from '@/domain/results';
import type { Poll, PollResults } from '@/domain/types';
import { formatSlot } from '@/shared/format';

import { HeatCell } from '../grid/HeatCell';
import { SlotGrid } from '../grid/SlotGrid';
import { Section } from '../ui/Section';
import { SlotDetails } from './SlotDetails';

type HeatmapProps = {
  poll: Poll;
  results: PollResults;
};

/** Heat grid of availability; tap a cell to see who can join. */
export const Heatmap = ({ poll, results }: HeatmapProps) => {
  const grid = useMemo(() => buildGrid(poll), [poll]);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const total = results.respondents.length;

  const renderCell = useCallback(
    (slot: string) => (
      <HeatCell
        key={slot}
        slot={slot}
        count={results.availability[slot]?.length ?? 0}
        total={total}
        active={slot === activeSlot}
        onSelect={setActiveSlot}
      />
    ),
    [results.availability, total, activeSlot],
  );

  const activeSummary = useMemo(
    () => (activeSlot ? getSlotSummary(activeSlot, results) : null),
    [activeSlot, results],
  );

  return (
    <Section>
      <SlotGrid grid={grid} renderCell={renderCell} />
      {activeSummary && (
        <SlotDetails
          label={formatSlot(activeSummary.slot, poll.timezone)}
          available={activeSummary.available}
          unavailable={activeSummary.unavailable}
          total={total}
        />
      )}
    </Section>
  );
};
