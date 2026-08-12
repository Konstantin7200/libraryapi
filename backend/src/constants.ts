const AccessTokenCookie = 'libraryApiAccessToken' as const;
const AccessTokenMaxAge = 15 * 60;
const RefreshTokenCookie = 'libraryApiRefreshToken' as const;
const RefreshTokenMaxAge = 7 * 24 * 60 * 60;
const BooksApiPageSize = 10;
const MemoryCacheTtl = 60 * 30;
const RedisTtl = 60 * 60 * 12;

export {
  AccessTokenCookie,
  RefreshTokenCookie,
  AccessTokenMaxAge,
  RefreshTokenMaxAge,
  BooksApiPageSize,
  MemoryCacheTtl,
  RedisTtl,
};
