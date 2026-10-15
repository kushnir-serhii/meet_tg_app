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

  schedule: (pollId: string, range: SlotRange | null, meetingUrl: string | null = null) =>
    apiRequest<PollDetails>(`/api/polls/${encodeURIComponent(pollId)}/schedule`, {
      method: 'PUT',
      body: { range, meetingUrl },
    }),

  /** Prepared inline message id for `WebApp.shareMessage`. */
  prepareShare: (pollId: string) =>
    apiRequest<{ id: string }>(`/api/polls/${encodeURIComponent(pollId)}/share`, {
      method: 'POST',
    }),

  remove: (pollId: string) =>
    apiRequest<{ ok: true }>(`/api/polls/${encodeURIComponent(pollId)}`, { method: 'DELETE' }),
};
