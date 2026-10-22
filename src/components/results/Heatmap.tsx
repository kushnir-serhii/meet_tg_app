'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import { buildGrid } from '@/domain/grid';
import { findRangeWithSlot } from '@/domain/ranges';
import { getListedRanges, getSlotSummary } from '@/domain/results';
import type { Poll, PollResults } from '@/domain/types';
import { useCanHover } from '@/hooks/useCanHover';
import { useDoubleTap } from '@/hooks/useDoubleTap';
import { useI18n } from '@/hooks/useI18n';
import { formatSlot } from '@/shared/format';

import { HeatCell } from '../grid/HeatCell';
import { HeatLegend } from '../grid/HeatLegend';
import { SlotGrid } from '../grid/SlotGrid';
import { Section } from '../ui/Section';
import styles from './results.module.css';
import { placePopover, type PopoverPlacement, SlotPopover } from './SlotPopover';
import { SlotSheet } from './SlotSheet';

type HeatmapProps = {
  poll: Poll;
  results: PollResults;
  /** Scroll the options list below to the range with this slot (desktop click, phone double tap). */
  onLocate?: (slot: string) => void;
};

/** Heat grid of availability: hover (desktop) or tap (phone) a cell to see who can join. */
export const Heatmap = ({ poll, results, onLocate }: HeatmapProps) => {
  const { t, locale } = useI18n();
  const canHover = useCanHover();
  const grid = useMemo(() => buildGrid(poll, locale), [poll, locale]);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ slot: string; placement: PopoverPlacement } | null>(
    null,
  );
  const total = results.respondents.length;
  const notResponded = poll.expectedCount === null ? null : Math.max(0, poll.expectedCount - total);

  const listed = getListedRanges(results);
  const isListed = useCallback(
    (slot: string) => onLocate !== undefined && findRangeWithSlot(listed, slot) !== undefined,
    [listed, onLocate],
  );

  const closeSheet = useCallback(() => {
    setActiveSlot(null);
  }, []);
  const clearPreview = useCallback(() => {
    setPreview(null);
  }, []);

  const onTap = useDoubleTap({
    onSingle: setActiveSlot,
    onDouble: (slot) => {
      setActiveSlot(null);
      onLocate?.(slot);
    },
    hasDouble: isListed,
  });
  const onClick = useCallback(
    (slot: string) => {
      if (!isListed(slot)) return;
      setPreview(null);
      onLocate?.(slot);
    },
    [isListed, onLocate],
  );

  const onPreview = useCallback((slot: string, cell: HTMLElement) => {
    if (anchorRef.current) setPreview({ slot, placement: placePopover(cell, anchorRef.current) });
  }, []);

  const renderCell = useCallback(
    (slot: string) => (
      <HeatCell
        key={slot}
        slot={slot}
        count={results.availability[slot]?.length ?? 0}
        total={total}
        byCreator={results.availability[slot]?.includes(poll.creatorId) ?? false}
        active={slot === activeSlot || slot === preview?.slot}
        onSelect={canHover ? onClick : onTap}
        onPreview={canHover ? onPreview : undefined}
      />
    ),
    [
      results.availability,
      poll.creatorId,
      total,
      activeSlot,
      preview,
      canHover,
      onClick,
      onTap,
      onPreview,
    ],
  );

  const shownSlot = canHover ? preview?.slot : activeSlot;
  const summary = useMemo(
    () => (shownSlot ? getSlotSummary(shownSlot, results) : null),
    [shownSlot, results],
  );
  const locateHint = canHover ? t.results.locateClick : t.results.locateDoubleTap;
  const card = summary && {
    label: formatSlot(summary.slot, poll.timezone, locale),
    available: summary.available,
    unavailable: summary.unavailable,
    total,
    notResponded,
    footnote: isListed(summary.slot) ? locateHint : undefined,
  };

  return (
    <Section>
      <div ref={anchorRef} className={styles.heatmapAnchor} onScrollCapture={clearPreview}>
        <SlotGrid
          grid={grid}
          renderCell={renderCell}
          bodyProps={{ onPointerLeave: clearPreview, onBlur: clearPreview }}
        />
        {card && preview && canHover && <SlotPopover {...card} placement={preview.placement} />}
      </div>
      <HeatLegend />
      {card && !canHover && <SlotSheet {...card} onClose={closeSheet} />}
    </Section>
  );
};
