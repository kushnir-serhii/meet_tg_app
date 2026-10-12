import { copy } from '@/shared/copy';

import { Field } from '../ui/Field';

type TitleFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export const TitleField = ({ value, onChange }: TitleFieldProps) => (
  <Field label={copy.create.title}>
    {(id, className) => (
      <input
        id={id}
        className={className}
        value={value}
        maxLength={80}
        placeholder={copy.create.titlePlaceholder}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    )}
  </Field>
);
