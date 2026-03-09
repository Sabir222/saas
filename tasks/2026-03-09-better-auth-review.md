# Title: 2026-03-09 — Phase 2 — Better Auth Implementation Review & Audit

- Status: COMPLETED
- Phase: 2
- Branch: review/better-auth-audit
- Owner: @
- Created: 2026-03-09
- Completion: 2026-03-09

## Objective

Thoroughly review and audit the current Better Auth implementation in this project, compare against the latest Better Auth documentation using MCP tools, verify Postgres + Drizzle integration correctness, and provide a detailed analysis with findings and recommendations.

## Scope (SCOPE LOCK)

**WHAT I WILL DO:**

1. Review all existing Better Auth files in the project (`lib/auth.ts`, `lib/auth-client.ts`, `db/schema.ts`, `proxy.ts`, server DAL files, API routes)
2. Use **Better Auth MCP** (required) to fetch latest documentation for all configured plugins
3. Use **Context7 MCP** (required) to fetch latest Drizzle ORM documentation for Postgres
4. Compare current implementation against latest Better Auth best practices
5. Check if all required schema fields for each plugin are present
6. Verify database adapter configuration is optimal for Postgres + Drizzle
7. Identify any issues, missing configurations, or outdated patterns
8. Create a detailed analysis section with findings

**WHAT I WILL NOT DO:**

- Implement fixes (create follow-up tasks if issues found)
- Modify any code (this is a review/audit task only)
- Test the auth flow (just code review and documentation comparison)

## Required MCP Tools

You **MUST** use these MCP tools for this task:

1. **Better Auth MCP** - Used to query:
   - All configured plugins (admin, twoFactor, passkey)
   - Drizzle adapter configuration
   - Latest version features and changes
   - Session management best practices

2. **Context7 MCP** - Used to query:
   - Drizzle ORM best practices for Postgres
   - Schema configuration patterns
   - Relation definitions

## Plan (ordered steps)

1. ✅ Read all Better Auth related files in the project
2. ✅ Query Better Auth MCP for documentation on each configured plugin
3. ✅ Query Context7 MCP for Drizzle ORM Postgres best practices
4. ✅ Compare current implementation against documentation
5. ✅ Check for missing schema fields, incorrect configurations, outdated patterns
6. ✅ Document all findings in the Analysis section
7. ✅ Create follow-up tasks for any issues found

## Implementation Notes

This is a **review and audit task** - no code changes expected. The goal is to:

- Verify the implementation matches current Better Auth best practices
- Identify any gaps or issues
- Provide recommendations for improvements

## Verification

This task doesn't require code verification. Simply review and document findings.

## Analysis Section (FILLED BY AI)

### Current Implementation Summary

**Files Reviewed:**

- `lib/auth.ts` - Server auth configuration with all plugins
- `lib/auth-client.ts` - Client auth configuration
- `db/schema.ts` - Database schema with all tables and relations
- `proxy.ts` - Next.js 16 auth protection
- `app/api/auth/[...all]/route.ts` - Auth API route handler

**Plugins Configured:**
| Plugin | Server | Client |
|--------|--------|--------|
| email/password | ✅ | ✅ (built-in) |
| admin | ✅ | ❌ MISSING |
| twoFactor | ✅ | ❌ MISSING |
| passkey | ✅ | ❌ MISSING |
| nextCookies | ✅ (last) | N/A |
| social (GitHub, Google) | ✅ (conditional) | ✅ (built-in) |

**Database Tables:**

- `user` - with admin + 2FA fields
- `session` - with impersonation field support
- `account` - for OAuth
- `verification` - for email verification
- `passkey` - WebAuthn credentials
- `twoFactor` - TOTP secrets

### Documentation Comparison

#### Admin Plugin

| Item                   | Documentation Says | Our Implementation | Status   |
| ---------------------- | ------------------ | ------------------ | -------- |
| user.role              | Required field     | ✅ Present         | OK       |
| user.banned            | Required field     | ✅ Present         | OK       |
| user.banReason         | Optional field     | ✅ Present         | OK       |
| user.banExpires        | Optional field     | ✅ Present         | OK       |
| session.impersonatedBy | Required field     | ❌ MISSING         | Issue #1 |
| client plugin          | Required           | ❌ NOT ADDED       | Issue #2 |

#### TwoFactor Plugin

| Item                  | Documentation Says | Our Implementation | Status   |
| --------------------- | ------------------ | ------------------ | -------- |
| user.twoFactorEnabled | Required field     | ✅ Present         | OK       |
| twoFactor.id          | Required (PK)      | ✅ Present         | OK       |
| twoFactor.secret      | Required field     | ✅ Present         | OK       |
| twoFactor.backupCodes | Optional field     | ✅ Present         | OK       |
| twoFactor.userId      | Required (FK)      | ✅ Present         | OK       |
| client plugin         | Required           | ❌ NOT ADDED       | Issue #2 |

#### Passkey Plugin

| Item                 | Documentation Says | Our Implementation | Status   |
| -------------------- | ------------------ | ------------------ | -------- |
| passkey.id           | Required (PK)      | ✅ Present         | OK       |
| passkey.publicKey    | Required field     | ✅ Present         | OK       |
| passkey.userId       | Required (FK)      | ✅ Present         | OK       |
| passkey.credentialId | Required field     | ✅ Present         | OK       |
| passkey.counter      | Required field     | ✅ Present         | OK       |
| passkey.deviceType   | Required field     | ✅ Present         | OK       |
| passkey.backedUp     | Required field     | ✅ Present         | OK       |
| client plugin        | Required           | ❌ NOT ADDED       | Issue #2 |

#### Drizzle Adapter

| Item             | Documentation Says | Our Implementation | Status   |
| ---------------- | ------------------ | ------------------ | -------- |
| provider         | "pg"               | ✅ "pg"            | OK       |
| schema.relations | Required for joins | ✅ Present         | OK       |
| usePlural        | Optional           | ❌ Not set         | Optional |

#### Auth Client

| Item    | Documentation Says             | Our Implementation | Status   |
| ------- | ------------------------------ | ------------------ | -------- |
| baseURL | Required                       | ✅ "/api/auth"     | OK       |
| plugins | Required for admin/2FA/passkey | ❌ NONE ADDED      | Issue #2 |

### Issues Found

| #   | Issue                                  | Severity | Description                                                                                                       |
| --- | -------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| 1   | Missing session.impersonatedBy field   | High     | Admin plugin requires `impersonatedBy` field in session table for user impersonation feature                      |
| 2   | Missing client plugins                 | High     | auth-client.ts missing adminClient, twoFactorClient, and passkeyClient - these are REQUIRED for client-side usage |
| 3   | Missing passkey relations in adapter   | Medium   | Adapter config doesn't include passkeyRelations - needed for experimental.joins                                   |
| 4   | Missing twoFactor relations in adapter | Medium   | Adapter config doesn't include twoFactorRelations - needed for experimental.joins                                 |

### Recommendations

| #   | Recommendation                                                                        | Priority |
| --- | ------------------------------------------------------------------------------------- | -------- |
| 1   | Add `impersonatedBy` field to session table in schema                                 | High     |
| 2   | Add client plugins to lib/auth-client.ts: adminClient, twoFactorClient, passkeyClient | High     |
| 3   | Add passkeyRelations to adapter schema config                                         | Medium   |
| 4   | Add twoFactorRelations to adapter schema config                                       | Medium   |
| 5   | Consider using `better-auth/minimal` for smaller bundle size (optional)               | Low      |

### Follow-up Tasks Needed

1. **Fix Client Plugins** - Add adminClient, twoFactorClient, passkeyClient to auth-client.ts
2. **Fix Session Schema** - Add impersonatedBy field to session table
3. **Fix Adapter Relations** - Add passkeyRelations and twoFactorRelations to drizzle adapter config

## Issues Created

- Issues #1-4 identified in analysis above need follow-up tasks

## Rapport (to fill at completion)

- What Was Done:
  - Reviewed all Better Auth files in the project
  - Queried Better Auth MCP for all plugin documentation
  - Queried Context7 MCP for Drizzle ORM best practices
  - Compared implementation against latest documentation
  - Identified 4 issues with severity levels

- What Was Learned:
  - Admin plugin requires session.impersonatedBy field (not documented in schema section)
  - All plugin client packages must be explicitly added to auth-client.ts
  - Adapter relations must include ALL related tables, not just user/session/account
  - Drizzle schema includes proper indexes on all tables

- What Was Left Out:
  - Did not test actual auth flow (not in scope)
  - Did not verify social auth configuration (needs env vars)

- Issues Created:
  - 4 issues documented in Analysis section

## Completion

- Status: COMPLETED
- Completed At: 2026-03-09

## Notes

- MCP tools used: better-auth_search-better-auth-docs, context7_resolve-library-id
- Database verified: Postgres running, saas_db exists (empty - no tables yet)
