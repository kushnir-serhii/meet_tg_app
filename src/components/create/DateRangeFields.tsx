import { addDays, format, parseISO } from 'date-fns';

import { MAX_POLL_DAYS } from '@/domain/dates';
import type { CreatePollFormValues } from '@/hooks/useCreatePollForm';
import { copy } from '@/shared/copy';

import { Field, FieldRow } from '../ui/Field';
import type { SetField } from './types';

type DateRangeFieldsProps = {
  values: Pick<CreatePollFormValues, 'dateFrom' | 'dateTo'>;
  setField: SetField;
  minDate: string;
};

const maxEndDate = (from: string): string =>
  format(addDays(parseISO(from), MAX_POLL_DAYS - 1), 'yyyy-MM-dd');

export const DateRangeFields = ({ values, setField, minDate }: DateRangeFieldsProps) => (
  <FieldRow>
    <Field label={copy.create.dateFrom}>
      {(id, className) => (
        <input
          id={id}
          type="date"
          className={className}
          min={minDate}
          value={values.dateFrom}
          onChange={(e) => {
            setField('dateFrom', e.target.value);
          }}
        />
      )}
    </Field>
    <Field label={copy.create.dateTo}>
      {(id, className) => (
        <input
          id={id}
          type="date"
          className={className}
          min={values.dateFrom}
          max={maxEndDate(values.dateFrom)}
          value={values.dateTo}
          onChange={(e) => {
            setField('dateTo', e.target.value);
          }}
        />
      )}
    </Field>
  </FieldRow>
);
