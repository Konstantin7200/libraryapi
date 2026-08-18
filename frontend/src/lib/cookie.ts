export const AccessTokenCookie = 'libraryApiAccessToken';
export const RefreshTokenCookie = 'libraryApiRefreshToken';
export const ForwardedAccessTokenHeader = 'x-library-api-access-token';

export type CookieOptions = {
  maxAge?: number;
  path?: string;
  domain?: string;
  sameSite?: 'lax' | 'strict' | 'none';
  httpOnly?: boolean;
  secure?: boolean;
  expires?: Date;
};

export type ParsedCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

export function parseSetCookie(header: string): ParsedCookie {
  const [nameValue, ...attributeParts] = header.split(';');
  const separator = nameValue.indexOf('=');
  const name = nameValue.slice(0, separator);
  const value = nameValue.slice(separator + 1);
  const options: CookieOptions = {};

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
  return { name, value, options };
}
