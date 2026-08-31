# Library API — Backend

NestJS backend for the Library application.

## Prerequisites

- Node.js 24 (see `.nvmrc`)
- PostgreSQL
- Redis

## Setup

```bash
npm install
cp .env.example .env
# Fill in .env values
```

## Required environment variables

| Variable | Description |
|----------|-------------|
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_USERNAME` | PostgreSQL user |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_NAME` | PostgreSQL database name |
| `DB_SSL` | Enable SSL for PostgreSQL (`true`/`false`) |
| `JWT_SECRET` | Secret for JWT signing |
| `CORS_ORIGIN` | Allowed CORS origin(s), comma-separated |
| `COOKIE_SECURE` | Secure cookies (`true`/`false`) |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| `REDIS_USERNAME` | Redis user |
| `REDIS_PASSWORD` | Redis password |
| `REDIS_TLS` | Enable TLS for Redis (`true`/`false`) |
| `PORT` | Server port (default: `3000`) |

All variables are validated at startup. The app will fail to start if any required variable is missing.

## Running

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Database

```bash
# Clear all tables
npm run db:clear
```

## Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```
