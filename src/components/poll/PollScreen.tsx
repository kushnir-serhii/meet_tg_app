'use client';

import { useMemo, useState } from 'react';

import { useI18n } from '@/hooks/useI18n';
import { usePollDetails } from '@/hooks/usePollDetails';
import { useSchedulePoll } from '@/hooks/useSchedulePoll';

import { ResultsView } from '../results/ResultsView';
import { ScheduledCard } from '../schedule/ScheduledCard';
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
  /** Unsaved edits in "Мій час" — flagged on the tab so they aren't forgotten on Results. */
  const [isDirty, setIsDirty] = useState(false);
  const { t } = useI18n();
  const scheduling = useSchedulePoll(pollId, update);
  const tabs = useMemo(
    () =>
      [
        { id: 'mine', label: isDirty ? `${t.poll.tabMine} •` : t.poll.tabMine },
        { id: 'results', label: t.poll.tabResults },
      ] as const,
    [t, isDirty],
  );

  if (state.status === 'loading') return <Loading />;
  if (state.status === 'error') return <ErrorState onRetry={reload} />;
  if (state.status === 'notFound') return <Notice message={t.poll.notFound} />;
  if (state.status === 'deleted') return <Notice message={t.poll.deleted} />;

  const { poll, results, myResponse, canManage, calendar } = state.data;

  return (
    <div className={styles.stack}>
      <PollHeader poll={poll} />
      {calendar && (
        <ScheduledCard
          poll={poll}
          calendar={calendar}
          canManage={canManage}
          isSaving={scheduling.isSaving}
          onChange={() => {
            setTab('results');
          }}
          onUnschedule={() => void scheduling.schedule(null)}
        />
      )}
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      {/* Both panels stay mounted: unsaved selection survives tab switches and the
          bottom Save/Done button stays visible on both tabs. */}
      <div className={styles.panel} hidden={tab !== 'mine'}>
        <AvailabilityEditor
          poll={poll}
          initialSlots={myResponse?.slots ?? []}
          hasResponse={myResponse != null}
          useNativeButton={!hideMainButton}
          onSaved={update}
          onDirtyChange={setIsDirty}
          onShowResults={() => {
            setTab('results');
          }}
        />
      </div>
      <div className={styles.panel} hidden={tab !== 'results'}>
        <ResultsView
          poll={poll}
          results={results}
          canManage={canManage}
          schedule={{
            isSaving: scheduling.isSaving,
            error: scheduling.error,
            submit: scheduling.schedule,
          }}
        />
      </div>
      <SupportSection />
      {canManage && <DeletePollButton pollId={poll.id} onDeleted={markDeleted} />}
    </div>
  );
};
