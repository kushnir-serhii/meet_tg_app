import { copy } from '@/shared/copy';

import { Field } from '../ui/Field';

type ExpectedCountFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export const ExpectedCountField = ({ value, onChange }: ExpectedCountFieldProps) => (
  <Field label={copy.create.expected}>
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
