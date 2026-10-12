import 'server-only';

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { HttpError } from './errors';

type Handler<C> = (request: Request, context: C) => Promise<Response>;

/** Wraps a route handler: maps known errors to JSON responses. */
export const handle =
  <C>(handler: Handler<C>): Handler<C> =>
  async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', issues: error.issues },
          { status: 400 },
        );
      }
      console.error(error);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
  };

export const readJson = async (request: Request): Promise<unknown> => {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, 'Invalid JSON');
  }
};
