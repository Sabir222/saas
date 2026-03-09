<!-- Task template for feature/bug slices. Copy to tasks/YYYY-MM-DD-phase-N-desc.md -->

# Title: 2026-03-07 — Phase 2 — Add Social Auth Providers

- Status: PENDING # PENDING | IN_PROGRESS | BLOCKED | COMPLETED
- Phase: 2
- Branch: feature/add-social-auth
- Owner: @
- Created: 2026-03-07
- Completion:

## Objective

Configure GitHub and Google social authentication providers in Better Auth.

## Scope (SCOPE LOCK)

WHAT I WILL DO:

- Add GitHub OAuth provider configuration
- Add Google OAuth provider configuration
- Add required environment variables documentation

WHAT I WILL NOT DO:

- Set up actual OAuth apps (assumes env vars will be provided)

> Scope is frozen after this section is completed. Any new work discovered must become a new task or a GitHub issue and be listed in "Issues Created" below.

## Plan (ordered steps)

1. Review Better Auth docs for social auth configuration
2. Update lib/auth.ts to include GitHub and Google providers
3. Add .env.example entries for required variables
4. Verify configuration syntax

## Implementation Notes

From analysis: No social auth configured. Need GitHub and Google providers.

Required env vars (to document):

- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

## Verification

- [ ] Providers added to auth config
- [ ] Env var documentation added
- [ ] No TypeScript errors

## Issues Created

-

## Rapport (to fill at completion)

- What Was Done:
- What Was Learned:
- What Was Left Out:
- Issues Created:

## Completion

- Status: NOT_STARTED
- Completed At: YYYY-MM-DDTHH:MM:SSZ

## Notes

- Related to: tasks/2026-03-07-better-auth-analysis.md
- Docs: /home/sabir/Projects/saas/betterAuth.md
