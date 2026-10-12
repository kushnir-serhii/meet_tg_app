import { SLOT_MINUTES, type SlotMinutes } from '@/domain/types';
import type { CreatePollFormValues } from '@/hooks/useCreatePollForm';
import { useI18n } from '@/hooks/useI18n';
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

export const HourRangeFields = ({ values, setField }: HourRangeFieldsProps) => {
  const { t } = useI18n();

  return (
    <FieldRow>
      <Field label={t.create.hourFrom}>
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
      <Field label={t.create.hourTo}>
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
      <Field label={t.create.slot}>
        {(id, className) => (
          <select
            id={id}
            className={className}
            value={values.slotMinutes}
            onChange={(e) => {
              setField('slotMinutes', Number(e.target.value) as SlotMinutes);
            }}
          >
            {SLOT_MINUTES.map((minutes) => (
              <option key={minutes} value={minutes}>
                {t.create.slotOption(minutes)}
              </option>
            ))}
          </select>
        )}
      </Field>
    </FieldRow>
  );
};
