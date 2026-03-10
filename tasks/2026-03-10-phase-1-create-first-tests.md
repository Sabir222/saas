<!-- Task template for feature/bug slices. Copy to tasks/YYYY-MM-DD-phase-N-desc.md -->

# BEFORE TACKLING THIS TASK: Analyze available MCPs and Skills

Available MCPs (use for research):
| MCP | Use When | Key Tools |
|-----|----------|-----------|
| nextjs_docs | Any Next.js question | fetch docs by path |
| nextjs_index | Discover running dev servers | list servers, get tools |
| shadcn | UI components | search, get examples, add |
| postgres | Database work | execute_sql, analyze |
| github | Issues, PRs | create_issue, search |
| better-auth | Auth questions | search docs, ask |
| context7 | Any library docs | resolve, query |
| magicui | UI animations | getComponents, getBackgrounds |
| filesystem | File operations | read, write, glob |
| playwright | Browser automation | navigate, click, fill |

Available Skills (invoke when relevant):
| Skill | Trigger |
|-------|---------|
| better-auth-best-practices | auth, better-auth |
| create-auth-skill | new auth, add auth |
| email-and-password-best-practices | email/password flows |
| organization-best-practices | orgs, teams, rbac |
| two-factor-authentication-best-practices | 2FA, MFA, TOTP |
| find-skills | "how do I", "find a skill", unsure |

IMPORTANT: Before starting this task:

1. Analyze what the task involves
2. Check which MCPs could help with research
3. Use find-skills skill if unsure whether a skill exists for this task domain
4. # Document which MCPs/Skills you'll use in Implementation Notes
   -->

# Title: 2026-03-10 — Phase 1 — Create First Tests

- Status: PENDING
- Phase: 1
- Branch: test/phase-1-first-tests
- Owner: @
- Created: 2026-03-10
- Completion:

## Objective

Create the first set of critical tests for the SaaS application focusing on authentication flows and security.

## Scope (SCOPE LOCK)

WHAT I WILL DO:

1. Check Context7 MCP for Vitest docs to understand testing best practices
2. Create Vitest tests for environment validation (`lib/Env.ts`)
3. Create Vitest tests for database health check (`lib/db-health.ts`)
4. Create Playwright E2E tests for Auth flows:
   - Sign up form validation and submission
   - Sign in with valid/invalid credentials
   - Sign out flow
   - Password reset (forgot password → reset)
   - Protected routes redirect when unauthenticated
5. Create Playwright E2E tests for Security:
   - Dashboard route protection (unauthenticated blocked)
   - Admin route protection (non-admin blocked)
   - Session validation

WHAT I WILL NOT DO:

- OAuth provider tests
- 2FA tests
- Passkey tests
- Email verification tests
- Admin user management tests
- Stripe/billing tests

## Plan (ordered steps)

1. Use context7_resolve_library_id to get Vitest library ID
2. Use context7_query_docs to fetch Vitest testing best practices
3. Create `__tests__/lib/env.test.ts` for env validation
4. Create `__tests__/lib/db-health.test.ts` for DB health
5. Create `__tests__/e2e/sign-up.test.ts` for sign up flow
6. Create `__tests__/e2e/sign-in.test.ts` for sign in flow
7. Create `__tests__/e2e/sign-out.test.ts` for sign out flow
8. Create `__tests__/e2e/password-reset.test.ts` for password reset
9. Create `__tests__/e2e/protected-routes.test.ts` for protected routes
10. Create `__tests__/e2e/admin-protection.test.ts` for admin protection
11. Verify tests run correctly

## Implementation Notes

**MCPs/Skills to use for this task:**

- context7_resolve_library_id - Get Vitest library ID
- context7_query_docs - Fetch Vitest docs for testing patterns
- filesystem - Read existing code to understand structure

## Verification

- `bun run test:vitest` passes
- `bun run test:playwright` runs all E2E tests
- `bun run lint` passes
- `bun run check:types` passes

## Issues Created

-

## Rapport (to fill at completion)

- What Was Done:
- What Was Learned:
- What Was Left Out:
- Issues Created:

## Completion

- Status: COMPLETED
- Completed At: YYYY-MM-DDTHH:MM:SSZ

## Notes

- Add links to PRs, CI runs, or external references here.
