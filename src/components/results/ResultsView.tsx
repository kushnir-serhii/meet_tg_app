import type { Poll, PollResults } from '@/domain/types';
import { copy } from '@/shared/copy';

import { Hint, Section } from '../ui/Section';
import { BestSlots } from './BestSlots';
import { Heatmap } from './Heatmap';
import { PerfectRanges } from './PerfectRanges';
import { Respondents } from './Respondents';

type ResultsViewProps = {
  poll: Poll;
  results: PollResults;
};

export const ResultsView = ({ poll, results }: ResultsViewProps) => {
  if (results.respondents.length === 0) {
    return (
      <Section>
        <Hint>{copy.results.noRespondents}</Hint>
      </Section>
    );
  }

  const hasPerfect = results.perfectRanges.length > 0;

  return (
    <>
      <Respondents respondents={results.respondents} expected={poll.expectedCount} />
      {hasPerfect ? (
        <PerfectRanges ranges={results.perfectRanges} timezone={poll.timezone} />
      ) : (
        <BestSlots
          ranges={results.bestRanges}
          count={results.bestCount}
          total={results.respondents.length}
          timezone={poll.timezone}
        />
      )}
      <Heatmap poll={poll} results={results} />
    </>
  );
};
