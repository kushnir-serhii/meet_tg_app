import { useI18n } from '@/hooks/useI18n';

import { Field } from '../ui/Field';

type ExpectedCountFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export const ExpectedCountField = ({ value, onChange }: ExpectedCountFieldProps) => {
  const { t } = useI18n();

  return (
    <Field label={t.create.expected}>
      {(id, className) => (
        <input
          id={id}
          className={className}
          type="number"
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
