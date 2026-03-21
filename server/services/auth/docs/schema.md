# Auth Database Schema (Current)

This document reflects the active Prisma schema used by the auth service.

## User

- Table: `User`
- Primary key: `consumerId` (`CHAR(8)`)

Fields:

- `consumerId` - 8 digits, unique, primary key
- `fullName` - up to 30 chars
- `dob` - date
- `gender` - single char (`M/F/O` expected by business rules)
- `mobile` - 10 digits, unique
- `aadhar` - 12 digits, unique, optional
- `email` - up to 50 chars, unique
- `kycStatus` - enum: `PENDING`, `VERIFIED`, `REJECTED`
- `connectionType` - enum: `DOMESTIC`, `COMMERCIAL`
- `isActive` - boolean
- `createdAt`, `updatedAt` - timestamps

Relations:

- One `User` to many `UserSession`
- One `User` to many `Address`

## UserSession

- Table: `UserSession`
- Primary key: `id` (UUID)

Fields:

- `id` - UUID
- `consumerId` - foreign key to `User.consumerId`
- `token` - JWT token value, unique (up to 256 chars)
- `expiry` - timestamp
- `createdAt` - timestamp

Behavior:

- Session is created after successful OTP verification.

## Address

- Table: `Address`
- Primary key: `id` (UUID)

Fields:

- `id` - UUID
- `consumerId` - foreign key to `User.consumerId`
- `addressType` - enum: `SERVICE`, `BILLING`
- `line1`, `line2`, `landmark`
- `city`, `district`, `state`
- `pincode` - 6 chars
- `latitude`, `longitude`
- `isDefault`
- `createdAt`, `updatedAt`

Constraint:

- Unique composite on (`consumerId`, `addressType`, `isDefault`)
