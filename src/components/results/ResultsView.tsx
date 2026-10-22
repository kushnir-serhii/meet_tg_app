'use client';

import { useCallback, useEffect, useState } from 'react';

import type { Poll, PollResults, SlotRange } from '@/domain/types';
import { useI18n } from '@/hooks/useI18n';
import type { LocateRequest } from '@/hooks/useLocateRange';

import { ScheduleForm } from '../schedule/ScheduleForm';
import { Hint, Section } from '../ui/Section';
import { BestSlots } from './BestSlots';
import { Heatmap } from './Heatmap';
import { PerfectRanges } from './PerfectRanges';
import { Respondents } from './Respondents';

type ResultsViewProps = {
  poll: Poll;
  results: PollResults;
  /** Organizer can schedule the meeting from a picked range. */
  canManage: boolean;
  schedule: {
    isSaving: boolean;
    error: boolean;
    submit: (range: SlotRange, meetingUrl: string | null) => Promise<boolean>;
  };
  /** The schedule form has its own confirm button: the screen hides its bottom button meanwhile. */
  onFormOpenChange?: (open: boolean) => void;
};

export const ResultsView = ({
  poll,
  results,
  canManage,
  schedule,
  onFormOpenChange,
}: ResultsViewProps) => {
  const { t } = useI18n();
  const [picked, setPicked] = useState<SlotRange | null>(null);
  const formOpen = picked !== null;
  const [locate, setLocate] = useState<LocateRequest | null>(null);
  const onLocate = useCallback((slot: string) => {
    setLocate((prev) => ({ slot, seq: (prev?.seq ?? 0) + 1 }));
  }, []);

  useEffect(() => {
    onFormOpenChange?.(formOpen);
  }, [formOpen, onFormOpenChange]);

  if (results.respondents.length === 0) {
    return (
      <Section>
        <Hint>{t.results.noRespondents}</Hint>
      </Section>
    );
  }

  const onPick = canManage ? setPicked : undefined;

  return (
    <>
      <Respondents respondents={results.respondents} expected={poll.expectedCount} />
      <Heatmap poll={poll} results={results} onLocate={onLocate} />
      {results.perfectRanges.length > 0 ? (
        <PerfectRanges poll={poll} ranges={results.perfectRanges} locate={locate} onPick={onPick} />
      ) : (
        <BestSlots
          ranges={results.bestRanges}
          count={results.bestCount}
          total={results.respondents.length}
          timezone={poll.timezone}
          locate={locate}
          onPick={onPick}
        />
      )}
      {picked && (
        <ScheduleForm
          key={picked.start}
          poll={poll}
          window={picked}
          isSaving={schedule.isSaving}
          error={schedule.error}
          onCancel={() => {
            setPicked(null);
          }}
          onSubmit={(range, meetingUrl) => {
            void schedule.submit(range, meetingUrl).then((ok) => {
              if (ok) setPicked(null);
            });
          }}
        />
      )}
    </>
  );
};
