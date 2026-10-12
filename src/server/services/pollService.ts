import 'server-only';

import { nanoid } from 'nanoid';

import { computeResults } from '@/domain/results';
import { generateSlots, sanitizeSlots } from '@/domain/slots';
import type { Participant, Poll, PollDetails, PollResults } from '@/domain/types';
import type { CreatePollInput } from '@/domain/validation';
import type { Locale } from '@/i18n';

import { forbidden, notFound } from '../http/errors';
import { type PollMessage, pollMessagesRepository } from '../repositories/pollMessagesRepository';
import { pollsRepository } from '../repositories/pollsRepository';
import { responsesRepository } from '../repositories/responsesRepository';

const POLL_ID_LENGTH = 10;

export const createPoll = (
  input: CreatePollInput,
  creator: Participant & { locale: Locale },
): Promise<Poll> =>
  pollsRepository.insert({
    id: nanoid(POLL_ID_LENGTH),
    title: input.title,
    creator_id: creator.userId,
    creator_name: creator.name,
    dates: input.dates,
    hour_from: input.hourFrom,
    hour_to: input.hourTo,
    slot_minutes: input.slotMinutes,
    timezone: input.timezone,
    expected_count: input.expectedCount,
    locale: creator.locale,
  });

export const getPollOrThrow = async (pollId: string): Promise<Poll> => {
  const poll = await pollsRepository.findById(pollId);
  if (!poll) throw notFound('Poll not found');
  return poll;
};

export const getPollResults = async (poll: Poll): Promise<PollResults> => {
  const responses = await responsesRepository.findByPoll(poll.id);
  return computeResults(generateSlots(poll), responses, poll.slotMinutes);
};

export const getPollDetails = async (pollId: string, userId: number): Promise<PollDetails> => {
  const poll = await getPollOrThrow(pollId);
  const responses = await responsesRepository.findByPoll(poll.id);

  return {
    poll,
    results: computeResults(generateSlots(poll), responses, poll.slotMinutes),
    myResponse: responses.find((r) => r.userId === userId) ?? null,
    canManage: poll.creatorId === userId,
  };
};

export const saveResponse = async (
  pollId: string,
  participant: Participant,
  slots: string[],
): Promise<PollDetails> => {
  const poll = await getPollOrThrow(pollId);
  await responsesRepository.upsert(poll.id, participant, sanitizeSlots(slots, generateSlots(poll)));
  return getPollDetails(poll.id, participant.userId);
};

/**
 * Deletes the poll with all responses (organizer only).
 * Returns the chat messages it was posted to, so they can be updated.
 */
export const deletePoll = async (
  pollId: string,
  userId: number,
): Promise<{ poll: Poll; messages: PollMessage[] }> => {
  const poll = await getPollOrThrow(pollId);
  if (poll.creatorId !== userId) throw forbidden('Only the organizer can delete the poll');

  const messages = await pollMessagesRepository.findByPoll(poll.id);
  await pollsRepository.deleteById(poll.id);
  return { poll, messages };
};
