'use client';

import { useCallback } from 'react';

import type { Poll } from '@/domain/types';
import { useCreatePoll } from '@/hooks/useCreatePoll';
import { useCreatePollForm } from '@/hooks/useCreatePollForm';
import { useMainButton } from '@/hooks/useMainButton';
import { copy } from '@/shared/copy';

import { ErrorText, Section } from '../ui/Section';
import styles from './create.module.css';
import { DateRangeFields } from './DateRangeFields';
import { ExpectedCountField } from './ExpectedCountField';
import { HourRangeFields } from './HourRangeFields';
import { TitleField } from './TitleField';

type CreatePollFormProps = {
  onCreated: (poll: Poll) => void;
};

export const CreatePollForm = ({ onCreated }: CreatePollFormProps) => {
  const { values, setField, input, minDate } = useCreatePollForm();
  const { create, isPending, error } = useCreatePoll(onCreated);

  const submit = useCallback(() => {
    if (input) void create(input);
  }, [input, create]);

  useMainButton({
    text: isPending ? copy.create.creating : copy.create.submit,
    onClick: submit,
    disabled: !input || isPending,
    loading: isPending,
  });

  return (
    <div className={styles.stack}>
      <h1 className={styles.heading}>{copy.create.heading}</h1>
      <Section>
        <TitleField
          value={values.title}
          onChange={(v) => {
            setField('title', v);
          }}
        />
      </Section>
      <Section>
        <DateRangeFields values={values} setField={setField} minDate={minDate} />
        <HourRangeFields values={values} setField={setField} />
      </Section>
      <Section>
        <ExpectedCountField
          value={values.expectedCount}
          onChange={(v) => {
            setField('expectedCount', v);
          }}
        />
      </Section>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};
