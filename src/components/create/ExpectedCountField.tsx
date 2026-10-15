import type { Ref } from 'react';

import { useI18n } from '@/hooks/useI18n';

import { Field } from '../ui/Field';

type ExpectedCountFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  ref?: Ref<HTMLInputElement>;
};

export const ExpectedCountField = ({ value, onChange, error, ref }: ExpectedCountFieldProps) => {
  const { t } = useI18n();

  return (
    <Field label={t.create.expected} error={error}>
      {(id, className) => (
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          className={className}
          type="number"
          name="pik-expected-count"
          autoComplete="off"
          inputMode="numeric"
          min={2}
          max={200}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
      )}
    </Field>
  );
};
