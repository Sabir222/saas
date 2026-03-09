# Title: 2026-03-07 — Better Auth Enhancements

- Status: IN_PROGRESS
- Phase: 2
- Branch: feat/better-auth-enhancements
- Owner: @
- Created: 2026-03-07
- Completion:

## Objective

Implement all Better Auth enhancements identified in the analysis to fully configure authentication for the SaaS boilerplate.

## Analysis Summary

### ✅ Already Working

- API Route at `/api/auth/[...all]`
- Server auth instance (`lib/auth.ts`)
- Drizzle adapter with pg provider
- Client with `createAuthClient`
- Database schema with relations
- email/password authentication

### ❌ Not Implemented

- proxy.ts for Next.js 16 auth protection
- Social auth (GitHub, Google)
- 2FA plugin
- Passkey plugin
- Admin plugin
- Relations passed through adapter config (for joins)

## Todo List (Implementation Order)

### Step 1: Fix Adapter Relations (Prerequisite)

- [ ] Update `lib/auth.ts` to pass relations through drizzle adapter schema object
- Required for `experimental.joins: true` to work properly

### Step 2: Add proxy.ts

- [ ] Create `proxy.ts` for Next.js 16 auth protection
- Use Better Auth docs pattern for optimistic redirects

### Step 3: Social Auth

- [ ] Add GitHub OAuth provider to `lib/auth.ts`
- [ ] Add Google OAuth provider to `lib/auth.ts`
- [ ] Add env vars to `.env.example`:
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

### Step 4: Admin Plugin

- [ ] Add `admin()` plugin to `lib/auth.ts`
- Required for: user management, role updates, bans, impersonation

### Step 5: 2FA Plugin

- [ ] Add `twoFactor()` plugin to `lib/auth.ts`
- TOTP-based two-factor authentication

### Step 6: Passkey Plugin

- [ ] Add `@better-auth/passkey` package
- [ ] Add `passkey()` plugin to `lib/auth.ts`
- WebAuthn/passkey authentication

## Files to Modify

- `lib/auth.ts` - Add all plugins and providers
- `proxy.ts` - Create new file
- `.env.example` - Add social auth env vars

## Verification

- [ ] Auth instance initializes without errors
- [ ] No TypeScript errors
- [ ] All plugins configured correctly

## Completion

- Status:
- Completed At:
