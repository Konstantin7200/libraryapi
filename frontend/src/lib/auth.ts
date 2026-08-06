import { EnvConfig } from '@/constants';
import { cookies } from 'next/headers';

const RefreshTokenCookie = 'libraryApiRefreshToken';

async function authenticate(
  path: 'login' | 'signup',
  login_: string,
  password: string,
) {
  const response = await fetch(`${EnvConfig.API_BASE}/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: login_, password }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const cookieStore = await cookies();
  for (const setCookie of response.headers.getSetCookie()) {
    applySetCookie(cookieStore, setCookie);
  }
}

function applySetCookie(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  header: string,
) {
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

  cookieStore.set(name, value, options);
}

async function signUp(login: string, password: string) {
  await authenticate('signup', login, password);
}

async function isLoggedIn() {
  const cookieStore = await cookies();
  return cookieStore.has(RefreshTokenCookie);
}

async function refresh() {
  const cookieHeader = (await cookies()).toString();
  const response = await fetch(`${EnvConfig.API_BASE}/auth/refresh`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }

  const cookieStore = await cookies();
  for (const setCookie of response.headers.getSetCookie()) {
    applySetCookie(cookieStore, setCookie);
  }
}

async function login(login: string, password: string) {
  await authenticate('login', login, password);
}

export { signUp, login, isLoggedIn };
