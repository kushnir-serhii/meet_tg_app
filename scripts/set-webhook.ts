/**
 * Registers the Telegram webhook and bot commands.
 * Usage: npm run webhook:set   (reads .env.local)
 */
export {};

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
};

const token = required('TELEGRAM_BOT_TOKEN');
const secret = required('TELEGRAM_WEBHOOK_SECRET');
const appUrl = required('APP_URL').replace(/\/$/, '');

const call = async (method: string, body: Record<string, unknown>): Promise<void> => {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  console.log(method, await response.json());
};

await call('setWebhook', {
  url: `${appUrl}/api/bot`,
  secret_token: secret,
  allowed_updates: ['message', 'inline_query', 'chosen_inline_result', 'pre_checkout_query'],
  drop_pending_updates: true,
});

/** Bot profile texts per language. Default (no language_code) = English. */
const profiles = [
  {
    language_code: undefined,
    command: 'Create a meeting',
    paySupport: 'Payment support',
    description:
      'Find a meeting time that works for everyone. Mark your free hours, and I show when they overlap.',
    short: 'Find a meeting time that works for everyone.',
  },
  {
    language_code: 'uk',
    command: 'Створити зустріч',
    paySupport: 'Підтримка з оплатою',
    description:
      'Знайдіть час для зустрічі, зручний усім. Кожен позначає вільні години — я покажу, коли вони збігаються.',
    short: 'Знайдіть час для зустрічі, зручний усім.',
  },
];

for (const { language_code, command, paySupport, description, short } of profiles) {
  await call('setMyCommands', {
    commands: [
      { command: 'start', description: command },
      { command: 'paysupport', description: paySupport },
    ],
    language_code,
  });
  await call('setMyDescription', { description, language_code });
  await call('setMyShortDescription', { short_description: short, language_code });
}
