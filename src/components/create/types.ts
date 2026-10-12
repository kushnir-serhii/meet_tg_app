import type { CreatePollFormValues } from '@/hooks/useCreatePollForm';

export type SetField = <K extends keyof CreatePollFormValues>(
  key: K,
  value: CreatePollFormValues[K],
) => void;
