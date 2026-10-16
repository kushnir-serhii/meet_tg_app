'use client';

import { useEffect, useRef } from 'react';

import type { CallDraft } from '@/domain/callServices';
import { MEETING_URL_MAX_LENGTH } from '@/domain/validation';
import { useI18n } from '@/hooks/useI18n';

import { Field } from '../ui/Field';
import { ErrorText, Hint } from '../ui/Section';
import { CallServiceChips } from './CallServiceChips';

type MeetingUrlFieldProps = {
  draft: CallDraft;
  value: string;
  invalid: boolean;
  onChange: (value: string) => void;
};

/** Optional video call link (Meet, Zoom, Teams…) for the scheduled meeting. */
/** A Calendar event link, not a call: people would land on the event, not in the call. */
const isCalendarEventLink = (value: string): boolean =>
  /^https?:\/\/(calendar\.app\.google|calendar\.google\.com)\b/i.test(value.trim());

export const MeetingUrlField = ({ draft, value, invalid, onChange }: MeetingUrlFieldProps) => {
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
      {isCalendarEventLink(value) && <ErrorText>{t.schedule.meetingUrlCalendarLink}</ErrorText>}
      <CallServiceChips
        draft={draft}
        onCreate={() => {
          waiting.current = true;
        }}
      />
      <Hint>{t.schedule.meetingUrlHint}</Hint>
    </>
  );
};
