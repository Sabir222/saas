<!-- Task template for feature/bug slices. Copy to tasks/YYYY-MM-DD-phase-N-desc.md -->

# Title: 2026-03-07 — Phase 2 — Fix Adapter Relations for Joins

- Status: PENDING # PENDING | IN_PROGRESS | BLOCKED | COMPLETED
- Phase: 2
- Branch: fix/adapter-relations
- Owner: @
- Created: 2026-03-07
- Completion:

## Objective

Fix the Better Auth drizzle adapter configuration to properly pass relations when using experimental.joins: true, as required by the docs.

## Scope (SCOPE LOCK)

WHAT I WILL DO:

- Update lib/auth.ts to pass relations through the drizzle adapter schema object
- Verify the configuration works with experimental.joins enabled

WHAT I WILL NOT DO:

- Run npx auth generate (create separate task if needed)
- Add any new plugins

> Scope is frozen after this section is completed. Any new work discovered must become a new task or a GitHub issue and be listed in "Issues Created" below.

## Plan (ordered steps)

1. Review current lib/auth.ts adapter configuration
2. Check Better Auth docs for relation-passing syntax
3. Update drizzle adapter to include relations
4. Test that auth instance initializes correctly

## Implementation Notes

From analysis: When using experimental.joins: true, the docs require passing relations through the drizzle adapter schema object. Currently only base tables are passed in lib/auth.ts:24-27.

Key file: `lib/auth.ts`

## Verification

- [ ] Auth instance initializes without errors
- [ ] experimental.joins remains enabled
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
