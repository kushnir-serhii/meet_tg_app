'use client';

import { useLanguageMenu } from '@/hooks/useLanguageMenu';
import { useLocale } from '@/hooks/useLocale';
import { useTelegram } from '@/hooks/useTelegram';
import { useTelegramInit } from '@/hooks/useTelegramInit';
import { I18nProvider } from '@/i18n/I18nProvider';
import { isInsideTelegram } from '@/lib/telegram/webApp';

import { CreateFlow } from '../create/CreateFlow';
import { PollScreen } from '../poll/PollScreen';
import { Loading } from '../ui/StateViews';
import { OpenInTelegram } from './OpenInTelegram';

type MiniAppProps = {
  /** Direct Mini App link for visitors from a regular browser. */
  telegramLink: string | null;
};

/** Picks the screen: `startapp=<pollId>` opens a poll, otherwise the create flow. */
const Screen = ({ telegramLink }: MiniAppProps) => {
  const webApp = useTelegram();
  useTelegramInit();
  useLanguageMenu();

  if (webApp === null) return <Loading />;
  if (!isInsideTelegram(webApp)) return <OpenInTelegram link={telegramLink} />;

  const pollId = webApp.initDataUnsafe.start_param;
  return pollId ? <PollScreen pollId={pollId} /> : <CreateFlow />;
};

/** Entry point: provides the user's language to the whole app. */
export const MiniApp = (props: MiniAppProps) => (
  <I18nProvider locale={useLocale()}>
    <Screen {...props} />
  </I18nProvider>
);
