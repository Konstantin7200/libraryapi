const AccessTokenCookie = 'libraryApiAccessToken' as const;
const AccessTokenMaxAge = 15 * 60;
const RefreshTokenCookie = 'libraryApiRefreshToken' as const;
const RefreshTokenMaxAge = 7 * 24 * 60 * 60;
const PageSize = 10;
const BookBatchSize = 50;
const MemoryCacheTtl = 60 * 30;
const RedisTtl = 60 * 60 * 12;
const RandomPageCount = 5;
const NoAuthorPlaceholder = 'No author found';

export {
  AccessTokenCookie,
  RefreshTokenCookie,
  AccessTokenMaxAge,
  RefreshTokenMaxAge,
  PageSize,
  BookBatchSize,
  MemoryCacheTtl,
  RedisTtl,
  RandomPageCount,
  NoAuthorPlaceholder,
};
