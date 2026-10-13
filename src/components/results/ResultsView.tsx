'use client';

import { useState } from 'react';

import type { Poll, PollResults, SlotRange } from '@/domain/types';
import { useI18n } from '@/hooks/useI18n';

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
    submit: (range: SlotRange) => Promise<boolean>;
  };
};

export const ResultsView = ({ poll, results, canManage, schedule }: ResultsViewProps) => {
  const { t } = useI18n();
  const [picked, setPicked] = useState<SlotRange | null>(null);

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
      <Heatmap poll={poll} results={results} />
      {results.perfectRanges.length > 0 ? (
        <PerfectRanges poll={poll} ranges={results.perfectRanges} onPick={onPick} />
      ) : (
        <BestSlots
          ranges={results.bestRanges}
          count={results.bestCount}
          total={results.respondents.length}
          timezone={poll.timezone}
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
          onSubmit={(range) => {
            void schedule.submit(range).then((ok) => {
              if (ok) setPicked(null);
            });
          }}
        />
      )}
    </>
  );
};
