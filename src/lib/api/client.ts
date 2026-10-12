import { getWebApp } from '../telegram/webApp';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
};

const readError = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? response.statusText;
  } catch {
    return response.statusText;
  }
};

/** Fetch wrapper that authenticates with Telegram `initData`. */
export const apiRequest = async <T>(
  path: string,
  { method = 'GET', body, signal }: RequestOptions = {},
): Promise<T> => {
  const response = await fetch(path, {
    method,
    signal,
    headers: {
      authorization: `tma ${getWebApp()?.initData ?? ''}`,
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) throw new ApiError(response.status, await readError(response));
  return (await response.json()) as T;
};
