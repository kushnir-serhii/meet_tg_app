import { copy } from '@/shared/copy';

import { Button } from './Button';
import styles from './ui.module.css';

export const Loading = () => (
  <div className={styles.center} aria-busy="true">
    <div className={styles.spinner} />
    <span>{copy.app.loading}</span>
  </div>
);

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export const ErrorState = ({ message = copy.app.genericError, onRetry }: ErrorStateProps) => (
  <div className={styles.center}>
    <span>{message}</span>
    {onRetry && (
      <Button variant="secondary" onClick={onRetry}>
        {copy.app.retry}
      </Button>
    )}
  </div>
);

export const Notice = ({ message }: { message: string }) => (
  <div className={styles.center}>{message}</div>
);
