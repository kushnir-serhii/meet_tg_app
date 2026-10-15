import { formatTime } from '@/shared/format';

import { Field } from '../ui/Field';

type TimeSelectProps = {
  label: string;
  value: string;
  /** ISO instants to choose from. */
  options: string[];
  timezone: string;
  onChange: (value: string) => void;
};

/** Labelled dropdown of times (shown in the poll's timezone). */
export const TimeSelect = ({ label, value, options, timezone, onChange }: TimeSelectProps) => (
  <Field label={label}>
    {(id, className) => (
      <select
        id={id}
        className={className}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {formatTime(option, timezone)}
          </option>
        ))}
      </select>
    )}
  </Field>
);
