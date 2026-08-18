'use server';

import { cookies, headers } from 'next/headers';
import { EnvConfig } from '@/constants';
import {
  AccessTokenCookie,
  ForwardedAccessTokenHeader,
  RefreshTokenCookie,
  parseSetCookie,
} from './cookie';
import type { ParsedCookie } from './cookie';
import { redirect } from 'next/navigation';

export type CookieStore = Awaited<ReturnType<typeof cookies>>;

export async function applySetCookie(store: CookieStore, header: string) {
  const { name, value, options }: ParsedCookie = parseSetCookie(header);
  store.set(name, value, options);
}

type ApiOptions = {
  method?: string;
  body?: unknown;
};

async function backendCookieHeader(): Promise<string | null> {
  const store = await cookies();
  const forwardedAccess = (await headers()).get(ForwardedAccessTokenHeader);
  const access = forwardedAccess ?? store.get(AccessTokenCookie)?.value;
  const refresh = store.get(RefreshTokenCookie)?.value;

  const pairs: string[] = [];
  if (access) pairs.push(`${AccessTokenCookie}=${access}`);
  if (refresh) pairs.push(`${RefreshTokenCookie}=${refresh}`);
  return pairs.length > 0 ? pairs.join('; ') : null;
}

export async function apiFetch(
  urlPath: string,
  { method, body }: ApiOptions = {},
): Promise<Response> {
  const requestHeaders: Record<string, string> = {};
  const cookie = await backendCookieHeader();
  if (cookie) requestHeaders['Cookie'] = cookie;
  if (body !== undefined) requestHeaders['Content-Type'] = 'application/json';

  const response = await fetch(`${EnvConfig.API_BASE}${urlPath}`, {
    method: method ?? 'GET',
    headers: requestHeaders,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (response.status === 403) return redirect('/login');
  return response;
}
