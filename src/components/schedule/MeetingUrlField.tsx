'use client';

import { useEffect, useRef } from 'react';

import { MEETING_URL_MAX_LENGTH } from '@/domain/validation';
import { useI18n } from '@/hooks/useI18n';

import { Field } from '../ui/Field';
import { Hint } from '../ui/Section';
import { CallServiceChips } from './CallServiceChips';

type MeetingUrlFieldProps = {
  value: string;
  invalid: boolean;
  onChange: (value: string) => void;
};

/** Optional video call link (Meet, Zoom, Teams…) for the scheduled meeting. */
export const MeetingUrlField = ({ value, invalid, onChange }: MeetingUrlFieldProps) => {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const waiting = useRef(false);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    const onReturn = () => {
      if (!waiting.current || document.visibilityState !== 'visible') return;
      waiting.current = false;
      if (!valueRef.current) inputRef.current?.focus();
    };
    document.addEventListener('visibilitychange', onReturn);
    window.addEventListener('focus', onReturn);
    return () => {
      document.removeEventListener('visibilitychange', onReturn);
      window.removeEventListener('focus', onReturn);
    };
  }, []);

  return (
    <>
      <Field
        label={t.schedule.meetingUrl}
        error={invalid ? t.schedule.meetingUrlInvalid : undefined}
      >
        {(id, className) => (
          <input
            id={id}
            ref={inputRef}
            type="url"
            inputMode="url"
            autoComplete="off"
            aria-invalid={invalid ? true : undefined}
            className={className}
            value={value}
            maxLength={MEETING_URL_MAX_LENGTH}
            placeholder={t.schedule.meetingUrlPlaceholder}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
        )}
      </Field>
      <CallServiceChips
        onCreate={() => {
          waiting.current = true;
        }}
      />
      <Hint>{t.schedule.meetingUrlHint}</Hint>
    </>
  );
};
