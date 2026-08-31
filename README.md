# Library API

Full-stack library management application with a NestJS backend and Next.js frontend.

## Project structure

```
├── backend/   NestJS API (TypeORM + PostgreSQL, Redis)
├── frontend/  Next.js 16 + React 19 + MUI + SCSS
└── reviews/   User reviews module
```

## Prerequisites

- Node.js 24 (see `.nvmrc` in each package)
- PostgreSQL
- Redis

## Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Fill in .env values

# Frontend
cd ../frontend
npm install
cp .env .env.local  # if needed
```

## Running

```bash
# Backend (development)
cd backend
npm run start:dev

# Frontend (development, port 5173)
cd frontend
npm run dev
```

## Backend environment variables

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

## Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Development with hot-reload |
| `npm run build && npm run start:prod` | Production build |
| `npm run test` | Unit tests |
| `npm run test:e2e` | End-to-end tests |
| `npm run test:cov` | Coverage report |
| `npm run db:clear` | Clear all tables |
| `npm run lint` | Lint |
| `npm run format` | Format with Prettier |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (port 5173) |
| `npm run build` | Production build |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
