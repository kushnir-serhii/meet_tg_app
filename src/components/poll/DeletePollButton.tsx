'use client';

import { useDeletePoll } from '@/hooks/useDeletePoll';
import { useI18n } from '@/hooks/useI18n';

import { Button } from '../ui/Button';
import { ErrorText } from '../ui/Section';
import styles from './poll.module.css';

type DeletePollButtonProps = {
  pollId: string;
  onDeleted: () => void;
};

export const DeletePollButton = ({ pollId, onDeleted }: DeletePollButtonProps) => {
  const { t } = useI18n();
  const { remove, isDeleting, error } = useDeletePoll(pollId, onDeleted);

  return (
    <>
      {error && <ErrorText>{t.app.genericError}</ErrorText>}
      <Button
        variant="secondary"
        className={styles.danger}
        loading={isDeleting}
        onClick={() => void remove()}
      >
        {t.poll.delete}
      </Button>
    </>
  );
};
