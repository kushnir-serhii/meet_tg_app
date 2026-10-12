'use client';

import type { Poll } from '@/domain/types';
import { useMainButton } from '@/hooks/useMainButton';
import { useShareToChat } from '@/hooks/useShareToChat';
import { copy } from '@/shared/copy';

import { PollScreen } from '../poll/PollScreen';
import { Hint, Section } from '../ui/Section';
import styles from './create.module.css';

type ShareStepProps = {
  poll: Poll;
};

/** After creation: share to a chat (native button) and fill own availability below. */
export const ShareStep = ({ poll }: ShareStepProps) => {
  const share = useShareToChat(poll.id);

  useMainButton({ text: copy.share.shareButton, onClick: share });

  return (
    <div className={styles.stack}>
      <Section title={copy.share.heading}>
        <Hint>{copy.share.hint}</Hint>
      </Section>
      <PollScreen pollId={poll.id} hideMainButton />
    </div>
  );
};
