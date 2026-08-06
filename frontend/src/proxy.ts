import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RefreshTokenCookie = 'libraryApiRefreshToken';

export function proxy(request: NextRequest) {
  if (!request.cookies.has(RefreshTokenCookie)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: '/profile/:path*',
};
