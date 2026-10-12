import type { SlotMinutes } from '@/domain/types';
import type { CreatePollFormValues } from '@/hooks/useCreatePollForm';
import { copy } from '@/shared/copy';
import { formatMinuteOfDay } from '@/shared/format';

import { Field, FieldRow } from '../ui/Field';
import type { SetField } from './types';

type HourRangeFieldsProps = {
  values: Pick<CreatePollFormValues, 'hourFrom' | 'hourTo' | 'slotMinutes'>;
  setField: SetField;
};

const hours = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

const HourOptions = ({ from, to }: { from: number; to: number }) =>
  hours(from, to).map((hour) => (
    <option key={hour} value={hour}>
      {formatMinuteOfDay(hour * 60)}
    </option>
  ));

export const HourRangeFields = ({ values, setField }: HourRangeFieldsProps) => (
  <FieldRow>
    <Field label={copy.create.hourFrom}>
      {(id, className) => (
        <select
          id={id}
          className={className}
          value={values.hourFrom}
          onChange={(e) => {
            setField('hourFrom', Number(e.target.value));
          }}
        >
          <HourOptions from={0} to={values.hourTo - 1} />
        </select>
      )}
    </Field>
    <Field label={copy.create.hourTo}>
      {(id, className) => (
        <select
          id={id}
          className={className}
          value={values.hourTo}
          onChange={(e) => {
            setField('hourTo', Number(e.target.value));
          }}
        >
          <HourOptions from={values.hourFrom + 1} to={24} />
        </select>
      )}
    </Field>
    <Field label={copy.create.slot}>
      {(id, className) => (
        <select
          id={id}
          className={className}
          value={values.slotMinutes}
          onChange={(e) => {
            setField('slotMinutes', Number(e.target.value) as SlotMinutes);
          }}
        >
          <option value={60}>{copy.create.slot60}</option>
          <option value={30}>{copy.create.slot30}</option>
        </select>
      )}
    </Field>
  </FieldRow>
);
