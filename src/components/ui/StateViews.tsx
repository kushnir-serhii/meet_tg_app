import { useI18n } from '@/hooks/useI18n';

import { Button } from './Button';
import styles from './ui.module.css';

export const Loading = () => {
  const { t } = useI18n();

  return (
    <div className={styles.center} aria-busy="true">
      <div className={styles.spinner} />
      <span>{t.app.loading}</span>
    </div>
  );
};

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  const { t } = useI18n();

  return (
    <div className={styles.center}>
      <span>{message ?? t.app.genericError}</span>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {t.app.retry}
        </Button>
      )}
    </div>
  );
};

export const Notice = ({ message }: { message: string }) => (
  <div className={styles.center}>{message}</div>
);
