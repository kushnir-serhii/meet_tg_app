'use client';

import { useMemo, useState } from 'react';

import { useI18n } from '@/hooks/useI18n';
import { usePollDetails } from '@/hooks/usePollDetails';

import { ResultsView } from '../results/ResultsView';
import { SupportSection } from '../support/SupportSection';
import { ErrorState, Loading, Notice } from '../ui/StateViews';
import { Tabs } from '../ui/Tabs';
import { AvailabilityEditor } from './AvailabilityEditor';
import { DeletePollButton } from './DeletePollButton';
import styles from './poll.module.css';
import { PollHeader } from './PollHeader';

type Tab = 'mine' | 'results';

type PollScreenProps = {
  pollId: string;
  /** When the bottom button is owned by a parent (e.g. share step). */
  hideMainButton?: boolean;
};

export const PollScreen = ({ pollId, hideMainButton = false }: PollScreenProps) => {
  const { state, reload, update, markDeleted } = usePollDetails(pollId);
  const [tab, setTab] = useState<Tab>('mine');
  const { t } = useI18n();
  const tabs = useMemo(
    () =>
      [
        { id: 'mine', label: t.poll.tabMine },
        { id: 'results', label: t.poll.tabResults },
      ] as const,
    [t],
  );

  if (state.status === 'loading') return <Loading />;
  if (state.status === 'error') return <ErrorState onRetry={reload} />;
  if (state.status === 'notFound') return <Notice message={t.poll.notFound} />;
  if (state.status === 'deleted') return <Notice message={t.poll.deleted} />;

  const { poll, results, myResponse, canManage } = state.data;

  return (
    <div className={styles.stack}>
      <PollHeader poll={poll} />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
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
      <SupportSection />
      {canManage && <DeletePollButton pollId={poll.id} onDeleted={markDeleted} />}
    </div>
  );
};
