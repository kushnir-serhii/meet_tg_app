import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { getEnv } from '../env';
import type { Database } from './database.types';

export type Db = SupabaseClient<Database>;

let client: Db | null = null;

export const getDb = (): Db => {
  if (!client) {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = getEnv();
    client = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
};
