'use client';

import { useMemo, useRef, useState } from 'react';

import { useI18n } from '@/hooks/useI18n';
import { usePollDetails } from '@/hooks/usePollDetails';
import { usePopup } from '@/hooks/usePopup';
import { useSchedulePoll } from '@/hooks/useSchedulePoll';

import { ResultsView } from '../results/ResultsView';
import { ScheduledCard } from '../schedule/ScheduledCard';
import { SupportSection } from '../support/SupportSection';
import { ErrorState, Loading, Notice } from '../ui/StateViews';
import { Tabs } from '../ui/Tabs';
import { AvailabilityEditor, type AvailabilityEditorHandle } from './AvailabilityEditor';
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
  const popup = usePopup();
  const editorRef = useRef<AvailabilityEditorHandle>(null);
  const scheduling = useSchedulePoll(pollId, update);
  const tabs = useMemo(
    () =>
      [
        { id: 'mine', label: isDirty ? `${t.poll.tabMine} •` : t.poll.tabMine },
        { id: 'results', label: t.poll.tabResults, locked: isDirty },
      ] as const,
    [t, isDirty],
  );

  /** Results would be stale with unsaved edits: ask to save (or drop) them first. */
  const openTab = async (next: Tab) => {
    if (next === tab) return;
    if (next === 'mine' || !isDirty) {
      setTab(next);
      return;
    }
    const choice = await popup({
      title: t.poll.unsavedTitle,
      message: t.poll.unsavedMessage,
      buttons: [
        { id: 'save', type: 'default', text: t.poll.saveAndView },
        { id: 'discard', type: 'destructive', text: t.poll.discard },
        { id: 'cancel', type: 'cancel' },
      ],
    });
    if (choice === 'save') {
      if (await editorRef.current?.save()) setTab('results');
    } else if (choice === 'discard') {
      editorRef.current?.discard();
      setTab('results');
    }
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
      {/* Both panels stay mounted: unsaved selection survives tab switches and the
          bottom Save/Done button stays visible on both tabs. */}
      <div className={styles.panel} hidden={tab !== 'mine'}>
        <AvailabilityEditor
          ref={editorRef}
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
