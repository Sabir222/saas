# 2026-03-07 — Remove `src/` directory

- Status: PENDING
- Phase: maintenance
- Branch: chore/remove-src-2026-03-07
- Owner: @
- Created: 2026-03-07

## Objective

Remove the top-level `src/` directory from the repository and update project configuration and agent rules so the project no longer references `src/` paths. Move any required files out of `src/` first.

## Scope (SCOPE LOCK)

WHAT I WILL DO:

- Move `src/db/schema.ts` → `db/schema.ts` and update references (drizzle.config, runbook, tasks).
- Remove the empty `src/` folder from the repository.
- Update `AGENT.md` to stop referencing `src/` (use `lib/` where appropriate).
- Create this task file and a local branch per workflow.

WHAT I WILL NOT DO:

- I will not push or open PRs (per repository push policy) without explicit authorization.
- I will not modify unrelated `src/` references scattered in docs or skill files beyond the obvious places changed above.

## Plan

1. Create branch `chore/remove-src-2026-03-07` locally.

## Verification

- `db/schema.ts` exists and is importable.
- `drizzle.config.ts` references `./db/schema.ts`.
- `src/` folder no longer exists in repo root.
