import { addDays, format, parseISO } from 'date-fns';

import { MAX_POLL_DAYS } from '@/domain/dates';
import type { CreatePollFormValues } from '@/hooks/useCreatePollForm';
import { useI18n } from '@/hooks/useI18n';

import { DatePicker } from '../ui/datePicker/DatePicker';
import { Field, FieldRow } from '../ui/Field';
import type { SetField } from './types';

type DateRangeFieldsProps = {
  values: Pick<CreatePollFormValues, 'dateFrom' | 'dateTo'>;
  setField: SetField;
  minDate: string;
};

const maxEndDate = (from: string): string =>
  format(addDays(parseISO(from), MAX_POLL_DAYS - 1), 'yyyy-MM-dd');

export const DateRangeFields = ({ values, setField, minDate }: DateRangeFieldsProps) => {
  const { t } = useI18n();

  return (
    <FieldRow>
      <Field label={t.create.dateFrom}>
        {(id, className) => (
          <DatePicker
            id={id}
            className={className}
            min={minDate}
            value={values.dateFrom}
            onChange={(value) => {
              setField('dateFrom', value);
            }}
          />
        )}
      </Field>
      <Field label={t.create.dateTo}>
        {(id, className) => (
          <DatePicker
            id={id}
            className={className}
            align="right"
            min={values.dateFrom}
            max={maxEndDate(values.dateFrom)}
            value={values.dateTo}
            onChange={(value) => {
              setField('dateTo', value);
            }}
          />
        )}
      </Field>
    </FieldRow>
  );
};
