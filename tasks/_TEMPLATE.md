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

<system-reminder>
Your operational mode is changed from plan to build.
You are permitted to make file changes, run shell commands, and utilize your arsenal of tools as needed.
</system-reminder>

# Title: YYYY-MM-DD — Phase N — Short description

- Status: PENDING # PENDING | IN_PROGRESS | BLOCKED | COMPLETED
- Phase: N
- Branch: type/phase-N-short-desc
- Owner: @
- Created: YYYY-MM-DD
- Completion:

## Objective

Concise 1-2 sentence statement of what this task will deliver. Focus on a single vertical slice.

## Scope (SCOPE LOCK)

WHAT I WILL DO:

-

WHAT I WILL NOT DO:

-

> Scope is frozen after this section is completed. Any new work discovered must become a new task or a GitHub issue and be listed in "Issues Created" below.

## Plan (ordered steps)

1.
2.
3.

## Implementation Notes

**MCPs/Skills to use for this task:**

- List which MCPs you'll use for research
- Invoke find-skills if you need help finding relevant skills

Atomic commit guidance, key files to modify, and any constraints or caveats.

## Verification

List the exact commands to run and the acceptance criteria. Examples:

- `bun run check:types` passes
- `bun run lint` passes
- `bun run test` with X tests passing

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
