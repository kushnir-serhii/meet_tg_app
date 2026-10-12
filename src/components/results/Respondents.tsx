import type { Participant } from '@/domain/types';
import { copy } from '@/shared/copy';

import { Section } from '../ui/Section';
import { NameChips } from './NameChips';

type RespondentsProps = {
  respondents: Participant[];
  expected: number | null;
};

export const Respondents = ({ respondents, expected }: RespondentsProps) => (
  <Section title={copy.results.respondents(respondents.length, expected)}>
    <NameChips people={respondents} />
  </Section>
);
