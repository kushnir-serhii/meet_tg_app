import type { TipAmount } from '@/domain/tips';

import { apiRequest } from './client';

export const tipsApi = {
  createInvoice: (amount: TipAmount) =>
    apiRequest<{ link: string }>('/api/tips', { method: 'POST', body: { amount } }),
};
