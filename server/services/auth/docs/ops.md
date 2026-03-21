# Auth Operations

## Login Flow

1. Client sends login identifier:

- `identifierType`: `M` (mobile), `A` (aadhar), `C` (consumer ID)
- `identifierValue`: value matching selected type

2. Server generates OTP:

- 6 digits
- TTL: 5 minutes
- Stored in Upstash Redis

3. Server sends OTP email:

- Google Apps Script URL is called with query params:
  - `email`
  - `name`
  - `otp`

4. Client verifies OTP:

- If OTP matches and is not expired, JWT is issued
- JWT expiry default is 1 hour
- Session is inserted into `UserSession` table

## External Integrations

- OTP provider URL:
  - `https://script.google.com/macros/s/AKfycbwVaewijYkVjInBkoLBWXy5c-FYSWJqc4BR0URsNO1Pu_wlDH6XwpSPkgRS1diVBbd07w/exec`
- Redis provider:
  - Upstash Redis via `REDIS_URL`

## API Endpoints (v1)

- `POST /api/v1/auth/login/otp`
- `POST /api/v1/auth/login/verify`

## Request/Response Standards

- Success envelope:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

- Error envelope:

```json
{
  "success": false,
  "error": {
    "code": "...",
    "message": "...",
    "details": null
  }
}
```

## Postman Assets

- Collection JSON: `docs/auth-service.collection.json`
- Test case guide: `docs/postman-test-cases.md`

## Operational Notes

- OTP is single-use. Reusing same OTP returns `OTP_NOT_FOUND`.
- In development mode OTP may be returned in API response for testing.
- In production mode OTP should be delivered only through provider, not API.
