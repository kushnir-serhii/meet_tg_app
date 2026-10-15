import type { Ref } from 'react';

import { useI18n } from '@/hooks/useI18n';

import { Field } from '../ui/Field';

type TitleFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  ref?: Ref<HTMLInputElement>;
};

export const TitleField = ({ value, onChange, error, ref }: TitleFieldProps) => {
  const { t } = useI18n();

  return (
    <Field label={t.create.title} error={error}>
      {(id, className) => (
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          className={className}
          name="pik-meeting-title"
          autoComplete="on"
          value={value}
          maxLength={80}
          placeholder={t.create.titlePlaceholder}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
      )}
    </Field>
  );
};
