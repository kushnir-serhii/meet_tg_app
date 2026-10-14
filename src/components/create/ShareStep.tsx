'use client';

import { useState } from 'react';

import type { Poll } from '@/domain/types';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/useI18n';
import { useShareToChat } from '@/hooks/useShareToChat';

import type { PrimaryAction } from '../poll/BottomAction';
import { PollScreen } from '../poll/PollScreen';
import { Button } from '../ui/Button';
import { Hint, Section } from '../ui/Section';
import styles from './create.module.css';

type ShareStepProps = {
  poll: Poll;
};

/**
 * After creation: mark own time (auto-saved) and send the poll to a chat.
 * Bottom button: "Send to chat" → once sent, "Done" (close); another chat — inline link.
 */
export const ShareStep = ({ poll }: ShareStepProps) => {
  const { t } = useI18n();
  const haptics = useHaptics();
  const share = useShareToChat(poll.id);
  const [sent, setSent] = useState(false);

  const shareNow = async () => {
    if (!(await share())) return;
    setSent(true);
    haptics.success();
  };
  const action: PrimaryAction | undefined = sent
    ? undefined
    : { text: t.share.shareButton, run: shareNow };

  return (
    <div className={styles.stack}>
      <Section title={sent ? t.share.sentHeading : t.share.heading}>
        <Hint>{sent ? t.share.sentHint : t.share.hint}</Hint>
        {sent && (
          <Button variant="secondary" onClick={() => void shareNow()}>
            {t.share.shareAgain}
          </Button>
        )}
      </Section>
      <PollScreen pollId={poll.id} action={action} />
    </div>
  );
};
