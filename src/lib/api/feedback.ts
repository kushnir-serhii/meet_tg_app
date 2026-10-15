import type { FeedbackInput } from '@/domain/feedback';

import { apiRequest } from './client';

export const feedbackApi = {
  send: (input: FeedbackInput) =>
    apiRequest<{ ok: true }>('/api/feedback', { method: 'POST', body: input }),
};
