/** Reads a required env variable (scripts load `.env.local` via `tsx --env-file`). */
export const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
};
