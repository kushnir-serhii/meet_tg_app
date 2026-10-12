'use client';

import { useState } from 'react';

import type { Poll } from '@/domain/types';

import { CreatePollForm } from './CreatePollForm';
import { ShareStep } from './ShareStep';

export const CreateFlow = () => {
  const [createdPoll, setCreatedPoll] = useState<Poll | null>(null);

  return createdPoll ? (
    <ShareStep poll={createdPoll} />
  ) : (
    <CreatePollForm onCreated={setCreatedPoll} />
  );
};
