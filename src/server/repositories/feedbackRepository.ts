import 'server-only';

import type { FeedbackSchemaInput } from '@/domain/validation';

import type { AuthUser } from '../auth/getAuthUser';
import { getDb } from '../db/client';

export const feedbackRepository = {
  /** One review per user: a new submission replaces the previous one. */
  async upsert(user: AuthUser, input: FeedbackSchemaInput): Promise<void> {
    const { error } = await getDb().from('feedback').upsert(
      {
        user_id: user.userId,
        name: user.name,
        username: user.username,
        rating: input.rating,
        text: input.text,
        can_publish: input.canPublish,
        locale: user.locale,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );
    if (error) throw error;
  },
};
