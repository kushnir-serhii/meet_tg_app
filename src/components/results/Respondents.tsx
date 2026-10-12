import type { Participant } from '@/domain/types';
import { useI18n } from '@/hooks/useI18n';

import { Section } from '../ui/Section';
import { NameChips } from './NameChips';

type RespondentsProps = {
  respondents: Participant[];
  expected: number | null;
};

export const Respondents = ({ respondents, expected }: RespondentsProps) => {
  const { t } = useI18n();

  return (
    <Section title={t.results.respondents(respondents.length, expected)}>
      <NameChips people={respondents} />
    </Section>
  );
};
