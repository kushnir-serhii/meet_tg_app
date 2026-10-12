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
  allowed_updates: ['message', 'inline_query', 'chosen_inline_result'],
  drop_pending_updates: true,
});

await call('setMyCommands', {
  commands: [{ command: 'start', description: 'Створити зустріч' }],
});
