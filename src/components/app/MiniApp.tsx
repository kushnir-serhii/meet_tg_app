'use client';

import { useTelegram } from '@/hooks/useTelegram';
import { useTelegramInit } from '@/hooks/useTelegramInit';
import { isInsideTelegram } from '@/lib/telegram/webApp';
import { copy } from '@/shared/copy';

import { CreateFlow } from '../create/CreateFlow';
import { PollScreen } from '../poll/PollScreen';
import { Loading, Notice } from '../ui/StateViews';

/** Entry point: `startapp=<pollId>` opens a poll, otherwise the create flow. */
export const MiniApp = () => {
  const webApp = useTelegram();
  useTelegramInit();

  if (webApp === null) return <Loading />;
  if (!isInsideTelegram(webApp)) return <Notice message={copy.app.openInTelegram} />;

  const pollId = webApp.initDataUnsafe.start_param;
  return pollId ? <PollScreen pollId={pollId} /> : <CreateFlow />;
};
