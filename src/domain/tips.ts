/** Tip options in Telegram Stars. */
export const TIP_AMOUNTS = [50, 100, 250] as const;

export type TipAmount = (typeof TIP_AMOUNTS)[number];

export const isTipAmount = (value: number): value is TipAmount =>
  (TIP_AMOUNTS as readonly number[]).includes(value);

const PAYLOAD_PREFIX = 'tip';

/** Invoice payload: "tip:<userId>:<amount>". */
export const buildTipPayload = (userId: number, amount: TipAmount): string =>
  `${PAYLOAD_PREFIX}:${userId}:${amount}`;

export const isTipPayload = (payload: string): boolean => payload.startsWith(`${PAYLOAD_PREFIX}:`);
