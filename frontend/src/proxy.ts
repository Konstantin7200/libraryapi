import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';
import { EnvConfig } from '@/constants';
import {
  AccessTokenCookie,
  ForwardedAccessTokenHeader,
  RefreshTokenCookie,
  parseSetCookie,
} from '@/lib/cookie';

export async function proxy(request: NextRequest) {
  if (request.cookies.has(AccessTokenCookie)) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get(RefreshTokenCookie)?.value;
  if (refreshToken === undefined) return NextResponse.next();

  let refreshResponse;
  try {
    refreshResponse = await axios.post(
      `${EnvConfig.API_BASE}/auth/refresh`,
      null,
      { headers: { Cookie: `${RefreshTokenCookie}=${refreshToken}` } },
    );
  } catch (error) {
    if (!axios.isAxiosError(error) || !error.response) throw error;
    const nextResponse = NextResponse.next();
    nextResponse.cookies.delete(AccessTokenCookie);
    nextResponse.cookies.delete(RefreshTokenCookie);
    return nextResponse;
  }

  const setCookies =
    (refreshResponse.headers['set-cookie'] as string[] | undefined) ?? [];
  const freshAccessToken = setCookies
    .map((header) => {
      const { name, value } = parseSetCookie(header);
      return name === AccessTokenCookie ? value : null;
    })
    .find((value): value is string => value !== null);

  const requestHeaders = new Headers(request.headers);
  if (freshAccessToken) {
    requestHeaders.set(ForwardedAccessTokenHeader, freshAccessToken);
  }

  const nextResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });
  for (const setCookie of setCookies) {
    const { name, value, options } = parseSetCookie(setCookie);
    nextResponse.cookies.set(name, value, options);
  }
  return nextResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};