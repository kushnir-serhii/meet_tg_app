# Meet TG App

Telegram Mini App + bot for finding a meeting time that suits everyone.
People mark free slots on a "days × hours" grid; the app shows times when everyone is free, or the best options and who can't make it.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · grammY · Supabase · Zod · Vitest

## How it works

1. `/start` in the bot (or `@bot` in any chat → "Створити нову зустріч") opens the Mini App.
2. Creator fills in title, dates, hours → poll is created.
3. "Надіслати в чат" → pick a chat → bot inserts the poll card (inline mode, the bot doesn't need to be in the group).
4. Participants tap "🗓 Позначити свій час" → Mini App with the poll (`startapp=<pollId>`).
5. On every save the bot edits all poll cards: who answered, perfect time or top-3 with names of those who can't.

## Languages

English and Ukrainian (`src/i18n/locales`). The Mini App follows the user's Telegram language;
chat messages use the organizer's language (stored in `polls.locale`). To add a language, add a
file next to `en.ts`, register it in `src/i18n/index.ts` and in the `locale` check constraint.

## Project structure

```
src/
  app/                 Next.js routes (page + API route handlers only, no logic)
    api/bot            Telegram webhook
    api/polls          create / get / save availability
  components/          UI split by feature
    app/               entry (routing by start_param)
    create/            create form + share step
    poll/              poll screen, availability editor
    results/           results, heatmap, name chips
    grid/              reusable "days × time" grid + cells
    telegram/          declarative wrappers over WebApp (MainButton)
    ui/                primitives (Button, Field, Section, Tabs, states)
  hooks/               client hooks (Telegram SDK, data fetching, drag-select, form)
  domain/              pure business logic: slots, results, grid, validation (tested)
  lib/                 client-side API wrapper + Telegram WebApp typings
  server/              server-only code
    auth/              Telegram initData → user
    bot/               grammY bot, handlers, message rendering & sync
    db/                Supabase client + types
    repositories/      DB access
    services/          use-cases
    http/              route error handling
    telegram/          initData validation, links
  shared/              copy (UI strings), formatting
  utils/
supabase/migrations/   SQL schema
scripts/               set-webhook
```

## Setup

### 1. Telegram (@BotFather)

- `/newbot` → token, username
- `/setinline` → enable inline mode (placeholder e.g. "Створити зустріч")
- `/setinlinefeedback` → **Enabled** (needed to edit the message after it's sent)
- after deploy: `/newapp` → choose the bot → Web App URL = your Vercel URL → short name (e.g. `meet`)

### 2. Supabase

New project → SQL Editor → run the files in `supabase/migrations/` in order (`0001` → `0003`)
(daily pg_cron job: deletes polls 7 days after their last date or 60 days after creation).
Only `SUPABASE_URL` and `service_role` key are needed (all access goes through the API; RLS is on with no policies).

### 3. Env

```bash
cp .env.example .env.local   # fill in values
```

Add the same variables in Vercel → Project → Settings → Environment Variables.

### 4. Run / deploy

```bash
npm install
npm run dev            # http://localhost:3000 (UI needs Telegram; use a tunnel like ngrok for real testing)
npm run check          # typecheck + lint + format check + tests
```

After deploying to Vercel:

```bash
npm run webhook:set    # registers https://<APP_URL>/api/bot + commands
```

## Scripts

| Script                    | What                                      |
| ------------------------- | ----------------------------------------- |
| `dev` / `build`           | Next.js                                   |
| `typecheck`               | `tsc --noEmit`                            |
| `lint` / `lint:fix`       | ESLint (Next + strict type-checked rules) |
| `format` / `format:check` | Prettier                                  |
| `test`                    | Vitest                                    |
| `check`                   | all of the above                          |
| `webhook:set`             | set Telegram webhook + commands           |

## Next iteration

- Group mode: bot added to a group, `/meet`, member count, reminders to those who haven't answered
- Recurring meetings, `.ics` export, min-duration search
- Telegram Stars (Pro)
