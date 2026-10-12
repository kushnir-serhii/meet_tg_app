import 'server-only';

import type { Poll } from '@/domain/types';

import { getDb } from '../db/client';
import type { Database } from '../db/database.types';
import { toPoll } from './mappers';

type PollInsert = Database['public']['Tables']['polls']['Insert'];

export const pollsRepository = {
  async insert(values: PollInsert): Promise<Poll> {
    const { data, error } = await getDb().from('polls').insert(values).select().single();
    if (error) throw error;
    return toPoll(data);
  },

  async findById(id: string): Promise<Poll | null> {
    const { data, error } = await getDb().from('polls').select().eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? toPoll(data) : null;
  },

  async findRecentByCreator(creatorId: number, limit = 10): Promise<Poll[]> {
    const { data, error } = await getDb()
      .from('polls')
      .select()
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data.map(toPoll);
  },
};
