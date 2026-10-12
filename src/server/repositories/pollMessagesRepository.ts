import 'server-only';

import { getDb } from '../db/client';
import type { Tables } from '../db/database.types';

export type PollMessage = Tables<'poll_messages'>;

export const pollMessagesRepository = {
  async findByPoll(pollId: string): Promise<PollMessage[]> {
    const { data, error } = await getDb().from('poll_messages').select().eq('poll_id', pollId);
    if (error) throw error;
    return data;
  },

  async addInline(pollId: string, inlineMessageId: string): Promise<void> {
    const { error } = await getDb()
      .from('poll_messages')
      .upsert(
        { poll_id: pollId, source: 'inline', inline_message_id: inlineMessageId },
        { onConflict: 'inline_message_id', ignoreDuplicates: true },
      );
    if (error) throw error;
  },
};
