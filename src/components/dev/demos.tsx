import type { ReactNode } from 'react';

import { CreatePollForm } from '../create/CreatePollForm';
import { ShareStep } from '../create/ShareStep';
import { FeedbackSection } from '../feedback/FeedbackSection';
import { AvailabilityEditor } from '../poll/AvailabilityEditor';
import { PollHeader } from '../poll/PollHeader';
import { SupportSection } from '../support/SupportSection';
import { BottomButton } from '../ui/BottomButton';
import { ErrorState, Loading, Notice } from '../ui/StateViews';
import { RESULTS_DEMOS } from './resultsDemos';
import { partialResponses, samplePoll } from './sampleData';

export type Demo = {
  id: string;
  title: string;
  note?: string;
  /** Fixed frame height, for demos whose overlay fills the screen. */
  height?: number;
  render: () => ReactNode;
};

const noop = () => undefined;

/** Large, screen-level components with fake data. Actions that call the API won't succeed. */
export const DEMOS: Demo[] = [
  { id: 'create', title: 'Create poll form', render: () => <CreatePollForm onCreated={noop} /> },
  { id: 'share', title: 'Share step', render: () => <ShareStep poll={samplePoll} /> },
  {
    id: 'editor',
    title: 'Poll header + availability editor («Мій час»)',
    note: 'Drag to select. Auto-save hits the API with a fake poll id, so it will report an error.',
    render: () => (
      <>
        <PollHeader poll={samplePoll} />
        <AvailabilityEditor
          poll={samplePoll}
          initialSlots={partialResponses[0]?.slots ?? []}
          hasResponse
          onSaved={noop}
        />
      </>
    ),
  },
  ...RESULTS_DEMOS,
  { id: 'feedback', title: 'Feedback section', render: () => <FeedbackSection /> },
  { id: 'support', title: 'Support section', render: () => <SupportSection /> },
  {
    id: 'states',
    title: 'Loading / error / notice + bottom button',
    height: 420,
    render: () => (
      <>
        <Loading />
        <ErrorState onRetry={noop} />
        <Notice message="Meeting not found — it may have been deleted or expired." />
        <BottomButton text="Готово" onPress={noop} />
      </>
    ),
  },
];
