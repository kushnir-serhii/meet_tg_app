'use client';

import { TIP_AMOUNTS } from '@/domain/tips';
import { useI18n } from '@/hooks/useI18n';
import { useTip } from '@/hooks/useTip';

import { Button } from '../ui/Button';
import { ErrorText, Hint, Section } from '../ui/Section';
import styles from './support.module.css';

/** Optional Stars tips — no features are locked behind them. */
export const SupportSection = () => {
  const { t } = useI18n();
  const { tip, status } = useTip();

  if (status === 'paid') {
    return (
      <Section>
        <Hint>{t.support.thanks}</Hint>
      </Section>
    );
  }

  return (
    <Section>
      <Hint>{t.support.title}</Hint>
      <div className={styles.amounts}>
        {TIP_AMOUNTS.map((amount) => (
          <Button
            key={amount}
            variant="secondary"
            disabled={status === 'loading'}
            onClick={() => void tip(amount)}
          >
            {t.support.amount(amount)}
          </Button>
        ))}
      </div>
      {status === 'error' && <ErrorText>{t.support.error}</ErrorText>}
    </Section>
  );
};
