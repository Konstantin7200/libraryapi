import { cookies } from 'next/headers';
import { apiFetch, applySetCookie } from './apiWrapper';

const RefreshTokenCookie = 'libraryApiRefreshToken';

async function authenticate(
  path: 'login' | 'signup',
  login_: string,
  password: string,
) {
  const response = await apiFetch(`/auth/${path}`, {
    method: 'POST',
    body: { login: login_, password },
  });

  const cookieStore = await cookies();
  const setCookies =
    (response.headers['set-cookie'] as string[] | undefined) ?? [];
  for (const setCookie of setCookies) {
    applySetCookie(cookieStore, setCookie);
  }
}

async function signUp(login: string, password: string) {
  await authenticate('signup', login, password);
}

async function isLoggedIn() {
  const cookieStore = await cookies();
  return cookieStore.has(RefreshTokenCookie);
}

async function login(login: string, password: string) {
  await authenticate('login', login, password);
}

export { signUp, login, isLoggedIn };