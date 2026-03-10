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

# Title: YYYY-MM-DD — Phase N — Add t3-env for Next.js-aware Env Validation

- Status: PENDING
- Phase: N
- Branch: feat/phase-N-t3-env
- Owner: @
- Created: YYYY-MM-DD
- Completion:

## Objective

Add t3-env (@t3-oss/env-nextjs) on top of existing Zod v4 for Next.js-aware environment variable validation with client/server separation.

## Scope (SCOPE LOCK)

WHAT I WILL DO:

- Install @t3-oss/env-nextjs
- Analyze existing lib/env-schema.ts to understand current env vars
- Create new env configuration using t3-env's createEnv
- Add client-safe variables (NEXT_PUBLIC_*)
- Add server-only variables (secrets, DB URLs)
- Add runtime validation at app startup
- Ensure backward compatibility with existing imports

WHAT I WILL NOT DO:

- Remove existing Zod validation (t3-env uses Zod internally)
- Add new environment variables
- Modify any feature logic

> Scope is frozen after this section is completed. Any new work discovered must become a new task or a GitHub issue and be listed in "Issues Created" below.

## Plan (ordered steps)

1. Install @t3-oss/env-nextjs using bun
2. Review current env-schema.ts to identify client vs server variables
3. Create new env.ts using t3-env's createEnv
4. Configure client variables (NEXT_PUBLIC_*)
5. Configure server variables (secrets, DB)
6. Add runtime validation
7. Test with valid env vars
8. Test with invalid env vars
9. Ensure backward compatibility

## Implementation Notes

> **⚠️ CRITICAL: Before writing any code, MUST use Context7 to fetch t3-env documentation**

**MCPs/Skills to use for this task:**

- **context7**: Fetch t3-env / @t3-oss/env-nextjs documentation
- **filesystem**: To read existing env-schema.ts

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
- Use existing Zod v4 installation (t3-env uses Zod internally)
- Add clear error messages for validation failures
