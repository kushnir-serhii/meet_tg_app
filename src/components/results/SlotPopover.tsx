import styles from './results.module.css';
import { SlotSummaryCard, type SlotSummaryCardProps } from './SlotSummaryCard';

/** Where to draw the card, in px relative to the heatmap's anchor box. */
export type PopoverPlacement = {
  /** Horizontal centre of the card (already clamped to the box). */
  x: number;
  /** Cell edge the card attaches to: its top edge when `above`, else its bottom edge. */
  y: number;
  above: boolean;
};

/** Half the card's width (see .popover) — keeps it inside the heatmap box. */
const HALF_WIDTH = 170;
const GAP = 8;

/** Centres the card on `cell`, inside `box`, on the side of the screen with more room. */
export const placePopover = (cell: HTMLElement, box: HTMLElement): PopoverPlacement => {
  const area = box.getBoundingClientRect();
  const rect = cell.getBoundingClientRect();
  const centre = rect.left + rect.width / 2 - area.left;
  const x = Math.min(Math.max(centre, HALF_WIDTH), Math.max(area.width - HALF_WIDTH, HALF_WIDTH));
  const above = rect.top + rect.height / 2 > window.innerHeight / 2;
  const y = (above ? rect.top - GAP : rect.bottom + GAP) - area.top;
  return { x, y, above };
};

type SlotPopoverProps = Omit<SlotSummaryCardProps, 'onClose'> & { placement: PopoverPlacement };

/** Desktop: hover card next to the cell, no backdrop. Ignores the mouse so moving on is smooth. */
export const SlotPopover = ({ placement, ...summary }: SlotPopoverProps) => (
  <div
    role="tooltip"
    className={placement.above ? styles.popoverAbove : styles.popover}
    style={{ left: placement.x, top: placement.y }}
  >
    <SlotSummaryCard {...summary} />
  </div>
);
