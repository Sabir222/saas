# Title: 2026-03-07 — Better Auth Implementation & Enhancements

- Status: IN_PROGRESS
- Phase: 1-2
- Branch: feat/better-auth-enhancements
- Owner: @
- Created: 2026-03-07
- Completion:

## Objective

Document the analysis of current Better Auth implementation against @betterAuth.md docs, then implement all identified enhancements to fully configure authentication for the SaaS boilerplate.

## Analysis Summary

### ✅ Already Working

| Requirement                        | Status | Project File                     |
| ---------------------------------- | ------ | -------------------------------- |
| API Route at `/api/auth/[...all]`  | ✅     | `app/api/auth/[...all]/route.ts` |
| `toNextJsHandler` export           | ✅     | Same file                        |
| Server auth instance (`auth`)      | ✅     | `lib/auth.ts`                    |
| Drizzle adapter with `pg` provider | ✅     | `lib/auth.ts`                    |
| `nextCookies()` plugin (last)      | ✅     | `lib/auth.ts`                    |
| Client with `createAuthClient`     | ✅     | `lib/auth-client.ts`             |
| Database schema with relations     | ✅     | `db/schema.ts`                   |
| `experimental.joins: true`         | ✅     | `lib/auth.ts`                    |
| email/password authentication      | ✅     | `lib/auth.ts`                    |
| Email verification                 | ✅     | `lib/auth.ts`                    |
| Session configuration              | ✅     | `lib/auth.ts`                    |

### ⚠️ Issues Found

1. **Missing relations in adapter config** - When using `experimental.joins: true`, the docs require passing relations through the drizzle adapter schema object. Currently only base tables are passed.

2. **Schema generated manually** - The schema in `db/schema.ts` was written manually. Docs recommend using `npx auth@latest generate` to sync schema.

### ❌ Not Implemented

- proxy.ts for Next.js 16 auth protection
- Social auth (GitHub, Google)
- 2FA plugin
- Passkey plugin
- Admin plugin

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
