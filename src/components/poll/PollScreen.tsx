'use client';

import { useState } from 'react';

import { usePollDetails } from '@/hooks/usePollDetails';
import { copy } from '@/shared/copy';

import { ResultsView } from '../results/ResultsView';
import { ErrorState, Loading } from '../ui/StateViews';
import { Tabs } from '../ui/Tabs';
import { AvailabilityEditor } from './AvailabilityEditor';
import styles from './poll.module.css';
import { PollHeader } from './PollHeader';

type Tab = 'mine' | 'results';

const TABS = [
  { id: 'mine', label: copy.poll.tabMine },
  { id: 'results', label: copy.poll.tabResults },
] as const;

type PollScreenProps = {
  pollId: string;
  /** When the bottom button is owned by a parent (e.g. share step). */
  hideMainButton?: boolean;
};

export const PollScreen = ({ pollId, hideMainButton = false }: PollScreenProps) => {
  const { state, reload, update } = usePollDetails(pollId);
  const [tab, setTab] = useState<Tab>('mine');

  if (state.status === 'loading') return <Loading />;
  if (state.status === 'error') return <ErrorState onRetry={reload} />;

  const { poll, results, myResponse } = state.data;

  return (
    <div className={styles.stack}>
      <PollHeader poll={poll} />
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'mine' ? (
        <AvailabilityEditor
          poll={poll}
          initialSlots={myResponse?.slots ?? []}
          useNativeButton={!hideMainButton}
          onSaved={update}
        />
      ) : (
        <ResultsView poll={poll} results={results} />
      )}
    </div>
  );
};
