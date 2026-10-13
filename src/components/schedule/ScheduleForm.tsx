'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { generateSlots } from '@/domain/slots';
import type { Poll, SlotRange } from '@/domain/types';
import { useI18n } from '@/hooks/useI18n';
import { formatDay, formatTime } from '@/shared/format';

import { Button } from '../ui/Button';
import { Field, FieldRow } from '../ui/Field';
import { ErrorText, Section } from '../ui/Section';
import styles from './schedule.module.css';

type ScheduleFormProps = {
  poll: Poll;
  /** Free window the organizer tapped; the meeting can be any part of it. */
  window: SlotRange;
  isSaving: boolean;
  error: boolean;
  onSubmit: (range: SlotRange) => void;
  onCancel: () => void;
};

const addMinutes = (iso: string, minutes: number): string =>
  new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();

export const ScheduleForm = ({
  poll,
  window: freeWindow,
  isSaving,
  error,
  onSubmit,
  onCancel,
}: ScheduleFormProps) => {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(freeWindow.start);
  const [end, setEnd] = useState(freeWindow.end);

  const starts = useMemo(
    () => generateSlots(poll).filter((s) => s >= freeWindow.start && s < freeWindow.end),
    [poll, freeWindow],
  );
  const ends = useMemo(
    () => starts.map((s) => addMinutes(s, poll.slotMinutes)).filter((e) => e > start),
    [starts, poll.slotMinutes, start],
  );

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [freeWindow]);

  const changeStart = (value: string) => {
    setStart(value);
    if (end <= value) setEnd(addMinutes(value, poll.slotMinutes));
  };

  return (
    <div ref={ref}>
      <Section title={t.schedule.formTitle}>
        <strong>{formatDay(freeWindow.start, poll.timezone, locale)}</strong>
        <FieldRow>
          <Field label={t.schedule.from}>
            {(id, className) => (
              <select
                id={id}
                className={className}
                value={start}
                onChange={(e) => {
                  changeStart(e.target.value);
                }}
              >
                {starts.map((s) => (
                  <option key={s} value={s}>
                    {formatTime(s, poll.timezone)}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label={t.schedule.to}>
            {(id, className) => (
              <select
                id={id}
                className={className}
                value={end}
                onChange={(e) => {
                  setEnd(e.target.value);
                }}
              >
                {ends.map((e) => (
                  <option key={e} value={e}>
                    {formatTime(e, poll.timezone)}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </FieldRow>
        {error && <ErrorText>{t.app.genericError}</ErrorText>}
        <div className={styles.actions}>
          <Button
            disabled={isSaving}
            onClick={() => {
              onSubmit({ start, end });
            }}
          >
            {isSaving ? t.schedule.saving : t.schedule.confirm}
          </Button>
          <Button variant="secondary" disabled={isSaving} onClick={onCancel}>
            {t.schedule.cancel}
          </Button>
        </div>
      </Section>
    </div>
  );
};
