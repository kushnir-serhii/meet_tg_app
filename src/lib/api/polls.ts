import type { Poll, PollDetails, SlotRange } from '@/domain/types';
import type { CreatePollInput } from '@/domain/validation';

import { apiRequest } from './client';

export const pollsApi = {
  create: (input: CreatePollInput) =>
    apiRequest<{ poll: Poll }>('/api/polls', { method: 'POST', body: input }),

  get: (pollId: string, signal?: AbortSignal) =>
    apiRequest<PollDetails>(`/api/polls/${encodeURIComponent(pollId)}`, { signal }),

  saveResponse: (pollId: string, slots: string[]) =>
    apiRequest<PollDetails>(`/api/polls/${encodeURIComponent(pollId)}/responses`, {
      method: 'PUT',
      body: { slots },
    }),

  schedule: (pollId: string, range: SlotRange | null) =>
    apiRequest<PollDetails>(`/api/polls/${encodeURIComponent(pollId)}/schedule`, {
      method: 'PUT',
      body: { range },
    }),

  remove: (pollId: string) =>
    apiRequest<{ ok: true }>(`/api/polls/${encodeURIComponent(pollId)}`, { method: 'DELETE' }),
};
