import { NextResponse } from 'next/server';

import { getMessages } from '@/i18n';
import { getAuthUser } from '@/server/auth/getAuthUser';
import { getBot } from '@/server/bot/bot';
import { buildPollArticle } from '@/server/bot/pollArticle';
import { handle } from '@/server/http/handle';
import { getPollOrThrow } from '@/server/services/pollService';

/**
 * Prepares the poll card for `WebApp.shareMessage` (Bot API 8.0+):
 * Telegram then opens its own chat picker with a preview — no inline results list.
 */
export const POST = handle<RouteContext<'/api/polls/[id]/share'>>(async (request, { params }) => {
  const user = getAuthUser(request);
  const { id } = await params;
  const poll = await getPollOrThrow(id);

  const article = await buildPollArticle(poll, getMessages(user.locale), true);
  const prepared = await getBot().api.savePreparedInlineMessage(user.userId, article, {
    allow_user_chats: true,
    allow_group_chats: true,
    allow_channel_chats: true,
  });

  return NextResponse.json({ id: prepared.id });
});
