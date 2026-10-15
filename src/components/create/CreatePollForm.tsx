'use client';

import { useCallback, useRef, useState } from 'react';

import type { Poll } from '@/domain/types';
import { useCreatePoll } from '@/hooks/useCreatePoll';
import { useCreatePollForm } from '@/hooks/useCreatePollForm';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/useI18n';
import { useMainButton } from '@/hooks/useMainButton';

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
  const { t } = useI18n();
  const { values, setField, input, invalid, minDate } = useCreatePollForm();
  const { create, isPending, error } = useCreatePoll(onCreated);
  const haptics = useHaptics();
  /** Errors appear only after the first "Create" tap, then update live as the user types. */
  const [showErrors, setShowErrors] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const expectedRef = useRef<HTMLInputElement>(null);

  // The button stays active: a tap on an incomplete form explains what's missing.
  const submit = useCallback(() => {
    if (isPending) return;
    if (input) {
      void create(input);
      return;
    }
    setShowErrors(true);
    haptics.error();
    const target = invalid.title ? titleRef.current : expectedRef.current;
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target?.focus();
  }, [input, invalid, isPending, create, haptics]);

  useMainButton({
    text: t.create.submit,
    onClick: submit,
    loading: isPending,
  });

  return (
    <div className={styles.stack}>
      <h1 className={styles.heading}>{t.create.heading}</h1>
      <Section>
        <TitleField
          ref={titleRef}
          error={showErrors && invalid.title ? t.create.titleRequired : undefined}
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
          ref={expectedRef}
          error={showErrors && invalid.expectedCount ? t.create.expectedInvalid : undefined}
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
