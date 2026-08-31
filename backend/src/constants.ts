const AccessTokenCookie = 'libraryApiAccessToken' as const;
const ACCESS_TOKEN_MAX_AGE_SEC = 15 * 60;
const RefreshTokenCookie = 'libraryApiRefreshToken' as const;
const REFRESH_TOKEN_MAX_AGE_SEC = 7 * 24 * 60 * 60;
const PageSize = 10;
const BookBatchSize = 50;
const MEMORY_CACHE_TTL_SEC = 60 * 30;
const REDIS_TTL_SEC = 60 * 60 * 12;
const RandomPageCount = 5;
const NoAuthorPlaceholder = 'No author found';
const SSE_HEARTBEAT_MS = 20_000;
const OPEN_LIBRARY_QUEUE_LIMIT = 10;
const OPEN_LIBRARY_GAP_MS = 1_500;

export {
  AccessTokenCookie,
  RefreshTokenCookie,
  ACCESS_TOKEN_MAX_AGE_SEC,
  REFRESH_TOKEN_MAX_AGE_SEC,
  PageSize,
  BookBatchSize,
  MEMORY_CACHE_TTL_SEC,
  REDIS_TTL_SEC,
  RandomPageCount,
  NoAuthorPlaceholder,
  SSE_HEARTBEAT_MS,
  OPEN_LIBRARY_QUEUE_LIMIT,
  OPEN_LIBRARY_GAP_MS,
};
