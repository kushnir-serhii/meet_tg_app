'use client';

import { MEETING_URL_MAX_LENGTH } from '@/domain/validation';
import { useI18n } from '@/hooks/useI18n';

import { Field } from '../ui/Field';
import { Hint } from '../ui/Section';

type MeetingUrlFieldProps = {
  value: string;
  invalid: boolean;
  onChange: (value: string) => void;
};

/** Optional video call link (Meet, Zoom, Teams…) for the scheduled meeting. */
export const MeetingUrlField = ({ value, invalid, onChange }: MeetingUrlFieldProps) => {
  const { t } = useI18n();

  return (
    <>
      <Field
        label={t.schedule.meetingUrl}
        error={invalid ? t.schedule.meetingUrlInvalid : undefined}
      >
        {(id, className) => (
          <input
            id={id}
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
      <Hint>{t.schedule.meetingUrlHint}</Hint>
    </>
  );
};
