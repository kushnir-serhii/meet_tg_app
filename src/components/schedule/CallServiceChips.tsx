'use client';

import { CALL_SERVICES, type CallDraft } from '@/domain/callServices';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/useI18n';
import { useOpenLink } from '@/hooks/useOpenLink';

import styles from './schedule.module.css';

type CallServiceChipsProps = {
  /** Meeting title and time, prefilled where the service supports it. */
  draft: CallDraft;
  /** Called after a chip is clicked, so the parent can wait for the pasted link. */
  onCreate: () => void;
};

/** Quick-create chips: open the service to create a call, then paste the link back. */
export const CallServiceChips = ({ draft, onCreate }: CallServiceChipsProps) => {
  const { t } = useI18n();
  const haptics = useHaptics();
  const openLink = useOpenLink();

  return (
    <div className={styles.chips}>
      <span className={styles.chipsLabel}>{t.schedule.createCall}</span>
      {CALL_SERVICES.map((service) => (
        <button
          key={service.id}
          type="button"
          className={service.id === 'meet' ? `${styles.chip} ${styles.chipPrimary}` : styles.chip}
          onClick={() => {
            haptics.selection();
            openLink(service.buildUrl(draft));
            onCreate();
          }}
        >
          {service.label}
        </button>
      ))}
    </div>
  );
};
