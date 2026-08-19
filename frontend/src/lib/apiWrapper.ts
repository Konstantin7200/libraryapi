'use server';

import { cookies, headers } from 'next/headers';
import axios, { AxiosResponse } from 'axios';
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

export async function apiFetch<T = unknown>(
  urlPath: string,
  { method, body }: ApiOptions = {},
): Promise<AxiosResponse<T>> {
  const requestHeaders: Record<string, string> = {};
  const cookie = await backendCookieHeader();
  if (cookie) requestHeaders['Cookie'] = cookie;

  try {
    return await axios.request<T>({
      url: `${EnvConfig.API_BASE}${urlPath}`,
      method: method ?? 'GET',
      headers: requestHeaders,
      data: body,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      redirect('/login');
    }
    throw error;
  }
}
