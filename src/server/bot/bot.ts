import 'server-only';

import { Bot } from 'grammy';

import { getEnv } from '../env';
import { registerChosenInlineResult } from './handlers/chosenInlineResult';
import { registerInlineQuery } from './handlers/inlineQuery';
import { registerStart } from './handlers/start';

let bot: Bot | null = null;

const createBot = (): Bot => {
  const instance = new Bot(getEnv().TELEGRAM_BOT_TOKEN);

  registerStart(instance);
  registerInlineQuery(instance);
  registerChosenInlineResult(instance);

  instance.catch(({ error }) => {
    console.error('Bot error', error);
  });

  return instance;
};

export const getBot = (): Bot => {
  bot ??= createBot();
  return bot;
};
