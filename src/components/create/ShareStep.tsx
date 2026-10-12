'use client';

import type { Poll } from '@/domain/types';
import { useI18n } from '@/hooks/useI18n';
import { useMainButton } from '@/hooks/useMainButton';
import { useShareToChat } from '@/hooks/useShareToChat';

import { PollScreen } from '../poll/PollScreen';
import { Hint, Section } from '../ui/Section';
import styles from './create.module.css';

type ShareStepProps = {
  poll: Poll;
};

/** After creation: share to a chat (native button) and fill own availability below. */
export const ShareStep = ({ poll }: ShareStepProps) => {
  const { t } = useI18n();
  const share = useShareToChat(poll.id);

  useMainButton({ text: t.share.shareButton, onClick: share });

  return (
    <div className={styles.stack}>
      <Section title={t.share.heading}>
        <Hint>{t.share.hint}</Hint>
      </Section>
      <PollScreen pollId={poll.id} hideMainButton />
    </div>
  );
};
