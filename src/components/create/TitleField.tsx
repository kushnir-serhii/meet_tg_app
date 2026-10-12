import { useI18n } from '@/hooks/useI18n';

import { Field } from '../ui/Field';

type TitleFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export const TitleField = ({ value, onChange }: TitleFieldProps) => {
  const { t } = useI18n();

  return (
    <Field label={t.create.title}>
      {(id, className) => (
        <input
          id={id}
          className={className}
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
