import { getSlotSummary } from '@/domain/results';
import { formatSlot } from '@/shared/format';

import { Heatmap } from '../results/Heatmap';
import { ResultsView } from '../results/ResultsView';
import { SlotSheet } from '../results/SlotSheet';
import { ScheduledCard } from '../schedule/ScheduledCard';
import { ScheduleForm } from '../schedule/ScheduleForm';
import type { Demo } from './demos';
import {
  emptyResults,
  partialResults,
  perfectResults,
  perfectWindow,
  sampleCalendar,
  samplePoll,
  scheduledPoll,
} from './sampleData';

const noop = () => undefined;
const schedule = { isSaving: false, error: false, submit: () => Promise.resolve(false) };
const sheetSlot = Object.keys(partialResults.availability)[60] ?? '';
const sheetSummary = getSlotSummary(sheetSlot, partialResults);

/** Results tab and scheduling. */
export const RESULTS_DEMOS: Demo[] = [
  {
    id: 'results-best',
    title: 'Results — no time fits everyone',
    note: 'Click a cell to open the who-can / who-can’t sheet inside the frame.',
    render: () => (
      <ResultsView poll={samplePoll} results={partialResults} canManage schedule={schedule} />
    ),
  },
  {
    id: 'results-perfect',
    title: 'Results — works for everyone',
    render: () => (
      <ResultsView poll={samplePoll} results={perfectResults} canManage schedule={schedule} />
    ),
  },
  {
    id: 'results-empty',
    title: 'Results — no responses',
    render: () => (
      <ResultsView poll={samplePoll} results={emptyResults} canManage schedule={schedule} />
    ),
  },
  {
    id: 'heatmap',
    title: 'Heatmap only',
    render: () => <Heatmap poll={samplePoll} results={partialResults} />,
  },
  {
    id: 'slot-sheet',
    title: 'Slot sheet (open)',
    note: 'On a desktop window it uses the centred-modal layout; phones get the bottom sheet.',
    height: 560,
    render: () => (
      <SlotSheet
        label={formatSlot(sheetSlot, samplePoll.timezone, 'uk')}
        available={sheetSummary.available}
        unavailable={sheetSummary.unavailable}
        total={partialResults.respondents.length}
        notResponded={5}
        onClose={noop}
      />
    ),
  },
  {
    id: 'schedule-form',
    title: 'Schedule form',
    render: () => (
      <ScheduleForm
        poll={samplePoll}
        window={perfectWindow}
        isSaving={false}
        error={false}
        onSubmit={noop}
        onCancel={noop}
      />
    ),
  },
  {
    id: 'scheduled',
    title: 'Scheduled meeting card',
    render: () => (
      <ScheduledCard
        poll={scheduledPoll}
        calendar={sampleCalendar}
        canManage
        isSaving={false}
        onChange={noop}
        onUnschedule={noop}
      />
    ),
  },
];
