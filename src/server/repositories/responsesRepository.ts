import 'server-only';

import type { Participant, PollResponse } from '@/domain/types';

import { getDb } from '../db/client';
import { toPollResponse } from './mappers';

export const responsesRepository = {
  async findByPoll(pollId: string): Promise<PollResponse[]> {
    const { data, error } = await getDb()
      .from('responses')
      .select()
      .eq('poll_id', pollId)
      .order('updated_at', { ascending: true });
    if (error) throw error;
    // An empty selection is "no answer" (also hides legacy empty rows).
    return data.map(toPollResponse).filter((response) => response.slots.length > 0);
  },

  async remove(pollId: string, userId: number): Promise<void> {
    const { error } = await getDb()
      .from('responses')
      .delete()
      .eq('poll_id', pollId)
      .eq('user_id', userId);
    if (error) throw error;
  },

  async upsert(pollId: string, participant: Participant, slots: string[]): Promise<void> {
    const { error } = await getDb().from('responses').upsert({
      poll_id: pollId,
      user_id: participant.userId,
      name: participant.name,
      username: participant.username,
      slots,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  },
};
