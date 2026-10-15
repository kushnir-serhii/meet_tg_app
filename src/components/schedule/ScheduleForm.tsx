'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { isBefore } from '@/domain/pastTime';
import { generateSlots } from '@/domain/slots';
import type { Poll, SlotRange } from '@/domain/types';
import { meetingUrlSchema } from '@/domain/validation';
import { useI18n } from '@/hooks/useI18n';
import { formatDay } from '@/shared/format';

import { Button } from '../ui/Button';
import { FieldRow } from '../ui/Field';
import { ErrorText, Section } from '../ui/Section';
import { MeetingUrlField } from './MeetingUrlField';
import styles from './schedule.module.css';
import { TimeSelect } from './TimeSelect';

type ScheduleFormProps = {
  poll: Poll;
  /** Free window the organizer tapped; the meeting can be any part of it. */
  window: SlotRange;
  isSaving: boolean;
  error: boolean;
  onSubmit: (range: SlotRange, meetingUrl: string | null) => void;
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
  const [now] = useState(() => new Date());
  const starts = useMemo(
    () =>
      generateSlots(poll).filter(
        (s) => s >= freeWindow.start && s < freeWindow.end && !isBefore(s, now),
      ),
    [poll, freeWindow, now],
  );
  const [start, setStart] = useState(starts[0] ?? freeWindow.start);
  const [end, setEnd] = useState(freeWindow.end);
  const [meetingUrl, setMeetingUrl] = useState(poll.meetingUrl ?? '');
  const [urlInvalid, setUrlInvalid] = useState(false);

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

  const submit = () => {
    const url = meetingUrlSchema.safeParse(meetingUrl);
    setUrlInvalid(!url.success);
    if (url.success) onSubmit({ start, end }, url.data);
  };

  // Nothing left in the future: the meeting can't be scheduled.
  if (starts.length === 0) return null;

  return (
    <div ref={ref}>
      <Section title={t.schedule.formTitle}>
        <strong>{formatDay(freeWindow.start, poll.timezone, locale)}</strong>
        <FieldRow>
          <TimeSelect
            label={t.schedule.from}
            value={start}
            options={starts}
            timezone={poll.timezone}
            onChange={changeStart}
          />
          <TimeSelect
            label={t.schedule.to}
            value={end}
            options={ends}
            timezone={poll.timezone}
            onChange={setEnd}
          />
        </FieldRow>
        <MeetingUrlField
          value={meetingUrl}
          invalid={urlInvalid}
          onChange={(value) => {
            setMeetingUrl(value);
            setUrlInvalid(false);
          }}
        />
        {error && <ErrorText>{t.app.genericError}</ErrorText>}
        <div className={styles.actions}>
          <Button loading={isSaving} onClick={submit}>
            {t.schedule.confirm}
          </Button>
          <Button variant="secondary" disabled={isSaving} onClick={onCancel}>
            {t.schedule.cancel}
          </Button>
        </div>
      </Section>
    </div>
  );
};
