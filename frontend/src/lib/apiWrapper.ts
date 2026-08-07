import { cookies } from 'next/headers';
import { EnvConfig } from '@/constants';

type CookieStore = Awaited<ReturnType<typeof cookies>>;

type ApiOptions = {
  method?: string;
  body?: unknown;
};

type ApiFetchOptions = {
  retryOnUnauthorized?: boolean;
};

export function applySetCookie(store: CookieStore, header: string): void {
  const [nameValue, ...attributeParts] = header.split(';');
  const separator = nameValue.indexOf('=');
  const name = nameValue.slice(0, separator);
  const value = nameValue.slice(separator + 1);
  const options: {
    maxAge?: number;
    path?: string;
    domain?: string;
    sameSite?: 'lax' | 'strict' | 'none';
    httpOnly?: boolean;
    secure?: boolean;
    expires?: Date;
  } = {};

  for (const part of attributeParts) {
    const trimmed = part.trim();
    const [key, rawValue] = trimmed.split('=');
    switch (key.toLowerCase()) {
      case 'max-age':
        options.maxAge = Number(rawValue);
        break;
      case 'path':
        options.path = rawValue;
        break;
      case 'domain':
        options.domain = rawValue;
        break;
      case 'samesite':
        options.sameSite = rawValue.toLowerCase() as 'lax' | 'strict' | 'none';
        break;
      case 'httponly':
        options.httpOnly = true;
        break;
      case 'secure':
        options.secure = true;
        break;
      case 'expires':
        options.expires = new Date(rawValue);
        break;
    }
  }

  store.set(name, value, options);
}

async function refresh(): Promise<boolean> {
  const header = (await cookies()).toString();
  const response = await fetch(`${EnvConfig.API_BASE}/auth/refresh`, {
    method: 'POST',
    cache: 'no-store',
    headers: header ? { Cookie: header } : {},
  });
  if (!response.ok) return false;

  const store = await cookies();
  for (const setCookie of response.headers.getSetCookie()) {
    applySetCookie(store, setCookie);
  }
  return true;
}

async function rawFetch(urlPath: string, { method, body }: ApiOptions): Promise<Response> {
  const header = (await cookies()).toString();
  const headers: Record<string, string> = {};
  if (header) headers['Cookie'] = header;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  return fetch(`${EnvConfig.API_BASE}${urlPath}`, {
    method: method ?? 'GET',
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

export async function apiFetch(
  urlPath: string,
  options: ApiOptions = {},
  { retryOnUnauthorized = true }: ApiFetchOptions = {},
): Promise<Response> {
  let response = await rawFetch(urlPath, options);
  if (
    retryOnUnauthorized &&
    response.status === 401 &&
    !urlPath.startsWith('/auth/refresh')
  ) {
    const refreshed = await refresh();
    if (refreshed) response = await rawFetch(urlPath, options);
  }
  return response;
}