import { createClient } from '@supabase/supabase-js';

import type { Database } from '../../src/server/db/database.types';
import { requiredEnv } from './env';

export const createScriptDb = () =>
  createClient<Database>(requiredEnv('SUPABASE_URL'), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
