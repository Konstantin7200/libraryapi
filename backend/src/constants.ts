const AccessTokenCookie = 'libraryApiAccessToken' as const;
const AccessTokenMaxAge = 15 * 60;
const RefreshTokenCookie = 'libraryApiRefreshToken' as const;
const RefreshTokenMaxAge = 7 * 24 * 60 * 60;

export {
  AccessTokenCookie,
  RefreshTokenCookie,
  AccessTokenMaxAge,
  RefreshTokenMaxAge,
};
