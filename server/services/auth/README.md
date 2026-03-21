# Auth Service

Auth service for SUVIDHA login using OTP and JWT sessions.

## Current Features

- Versioned API routes under `/api/v1/auth`
- Identifier-based login (`M`, `A`, `C`)
- OTP generation (6 digits, 5-minute TTL)
- OTP delivery through Google Apps Script
- OTP state persisted in Upstash Redis
- JWT issue on successful OTP verification (default 1 hour)
- Session persistence in PostgreSQL via Prisma (`UserSession`)
- Postman collection with positive and negative test cases

## API Endpoints

- `POST /api/v1/auth/login/otp`
- `POST /api/v1/auth/login/verify`
- `GET /health`
- `GET /`

## Environment Variables

- `PORT` (default `4009`)
- `NODE_ENV` (`development` or `production`)
- `DATABASE_URL` (PostgreSQL URL for Prisma)
- `JWT_SECRET` (JWT signing secret)
- `JWT_EXPIRES_IN` (optional, default `1h`)
- `OTP_PROVIDER_URL` (Google Apps Script endpoint)
- `REDIS_URL` (Upstash Redis URL)

Note: The service also supports `REID_URL` as a fallback alias for Redis URL.

## Directory Layout

```text
auth/
  src/
    config/        # env and runtime config
    controllers/   # HTTP handlers
    lib/           # Prisma and Redis clients
    middleware/    # error/not-found handlers
    routes/        # endpoint mappings
    services/      # auth + otp business logic
    utils/         # response/error/identifier helpers
  prisma/
    migrations/    # committed DB migrations
    schema.prisma  # data model
  docs/
    ops.md
    schema.md
    postman-test-cases.md
    auth-service.collection.json
  scripts/
    seed-users.js
    check-user.js
```

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client:

```bash
npx prisma generate
```

3. Apply schema in development:

```bash
npx prisma db push
```

4. Seed test users:

```bash
npm run seed:users
```

5. Start service:

```bash
npm run dev
```

## Deployment Notes

- Keep `prisma/schema.prisma` and `prisma/migrations` in Git.
- Never commit `.env`.
- Use production-grade managed PostgreSQL and Redis credentials.
- Do not expose OTP in API responses in production.
