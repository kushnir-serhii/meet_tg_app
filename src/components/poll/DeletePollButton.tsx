'use client';

import { useDeletePoll } from '@/hooks/useDeletePoll';
import { copy } from '@/shared/copy';

import { Button } from '../ui/Button';
import { ErrorText } from '../ui/Section';
import styles from './poll.module.css';

type DeletePollButtonProps = {
  pollId: string;
  onDeleted: () => void;
};

export const DeletePollButton = ({ pollId, onDeleted }: DeletePollButtonProps) => {
  const { remove, isDeleting, error } = useDeletePoll(pollId, onDeleted);

  return (
    <>
      {error && <ErrorText>{copy.app.genericError}</ErrorText>}
      <Button
        variant="secondary"
        className={styles.danger}
        disabled={isDeleting}
        onClick={() => void remove()}
      >
        {isDeleting ? copy.poll.deleting : copy.poll.delete}
      </Button>
    </>
  );
};
