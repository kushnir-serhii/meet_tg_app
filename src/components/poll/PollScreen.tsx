'use client';

import { useMemo, useRef, useState } from 'react';

import { useI18n } from '@/hooks/useI18n';
import { usePollDetails } from '@/hooks/usePollDetails';
import { useSchedulePoll } from '@/hooks/useSchedulePoll';
import { useTelegram } from '@/hooks/useTelegram';

import { FeedbackSection } from '../feedback/FeedbackSection';
import { ResultsView } from '../results/ResultsView';
import { ScheduledCard } from '../schedule/ScheduledCard';
import { SupportSection } from '../support/SupportSection';
import { ErrorState, Loading, Notice } from '../ui/StateViews';
import { Tabs } from '../ui/Tabs';
import { AvailabilityEditor, type AvailabilityEditorHandle } from './AvailabilityEditor';
import { BottomAction, type PrimaryAction } from './BottomAction';
import { DeletePollButton } from './DeletePollButton';
import styles from './poll.module.css';
import { PollHeader } from './PollHeader';

type Tab = 'mine' | 'results';

type PollScreenProps = {
  pollId: string;
  /** Bottom-button action (share step: "Send to chat"). Default: "Done" — closes the app. */
  action?: PrimaryAction;
};

export const PollScreen = ({ pollId, action }: PollScreenProps) => {
  const { state, reload, update, markDeleted } = usePollDetails(pollId);
  const [tab, setTab] = useState<Tab>('mine');
  const { t } = useI18n();
  const webApp = useTelegram();
  const editorRef = useRef<AvailabilityEditorHandle>(null);
  const scheduling = useSchedulePoll(pollId, update);
  const tabs = useMemo(
    () =>
      [
        { id: 'mine', label: t.poll.tabMine },
        { id: 'results', label: t.poll.tabResults },
      ] as const,
    [t],
  );
  const primary: PrimaryAction = action ?? { text: t.poll.close, run: () => webApp?.close() };

  /** Everything is auto-saved; just make sure a pending save has landed. */
  const flush = async (): Promise<boolean> => (await editorRef.current?.flush()) ?? true;

  const openTab = async (next: Tab) => {
    if (next === tab) return;
    // Results should include the latest edits; on failure stay put — the error is shown.
    if (next === 'results' && !(await flush())) return;
    setTab(next);
  };

  const runPrimary = async () => {
    if (await flush()) await primary.run();
  };

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
            void openTab('results');
          }}
          onUnschedule={() => void scheduling.schedule(null)}
        />
      )}
      <Tabs
        tabs={tabs}
        active={tab}
        onChange={(next) => {
          void openTab(next);
        }}
      />
      {/* Both panels stay mounted: the editor keeps its selection and pending save. */}
      <div className={styles.panel} hidden={tab !== 'mine'}>
        <AvailabilityEditor
          ref={editorRef}
          poll={poll}
          initialSlots={myResponse?.slots ?? []}
          hasResponse={myResponse !== null}
          onSaved={update}
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
      <FeedbackSection />
      {canManage && <DeletePollButton pollId={poll.id} onDeleted={markDeleted} />}
      <BottomAction text={primary.text} onPress={runPrimary} />
    </div>
  );
};
