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

# Title: 2026-03-10 — Phase 1 — Zod Environment Validation

- Status: PENDING
- Phase: 1
- Branch: feat/phase-1-zod-env-validation
- Owner: @
- Created: 2026-03-10
- Completion:

## Objective

Add Zod v4 for runtime environment variable validation, following PROJECT.md line 338: "Validate every env var in one typed env module"

## Scope (SCOPE LOCK)

WHAT I WILL DO:

- Install Zod v4
- Analyze the project to find all places where env vars are accessed
- Create Zod schemas for all environment variables in a new `lib/env-schema.ts`
- Add runtime validation to fail-fast on misconfigured env vars

WHAT I WILL NOT DO:

- Modify any feature logic (auth, database, etc.)
- Add new environment variables

> Scope is frozen after this section is completed. Any new work discovered must become a new task or a GitHub issue and be listed in "Issues Created" below.

## Plan (ordered steps)

1. Install Zod v4 using `bun add zod@^4.0.0`
2. Analyze the project to identify all places where environment variables are accessed and where Zod validation should be added
3. Create `lib/env-schema.ts` with Zod v4 schemas for all env vars
4. Update `lib/Env.ts` to use Zod validation at startup
5. Test with valid env vars
6. Test with invalid env vars to verify fail-fast behavior

## Implementation Notes

> **⚠️ CRITICAL: Before writing any code, you MUST use Context7 to fetch Zod v4 documentation**
>
> Zod v4 has breaking changes from v3, new features like Zod Mini, and different API. Using outdated v3 knowledge will cause implementation errors.
>
> Use context7_resolve-library-id with libraryName "zod" to find Zod v4, then context7_query-docs to learn the v4 API.

**MCPs/Skills to use for this task:**

- **context7**: REQUIRED - Fetch Zod v4 documentation before implementing (zod v4 has breaking changes from v3, new features like Zod Mini, and different API)
- **filesystem**: To analyze project structure and find env var usage

After installing Zod, thoroughly analyze the project to determine:

- All locations where env vars are read
- The best place(s) to add Zod validation (e.g., at module load time in `lib/Env.ts`)
- Whether validation should be lazy or eager

## Verification

- `bun run typecheck` passes
- `bun run build` works with valid env vars
- Build fails with clear error messages when required env vars are missing

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

- Keep backward compatibility with existing code
- Add clear error messages for validation failures
- **IMPORTANT**: Use Context7 to fetch Zod v4 documentation before implementing
