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

# Title: 2026-03-10 — Phase N — Add Commitlint with Lefthook

- Status: COMPLETED
- Phase: N
- Branch: commitlint-imp
- Owner: @
- Created: 2026-03-10
- Completion:

## Objective

Add commitlint with lefthook git hooks to enforce conventional commit messages.

## Scope (SCOPE LOCK)

WHAT I WILL DO:

- Install @commitlint/cli, @commitlint/config-conventional, and lefthook
- Create commitlint.config.js with conventional commits configuration
- Create lefthook.yml with commit-msg hook for commitlint
- Add lefthook install to package.json
- Verify commitlint works with test commit
- Add commitmsg script to package.json for manual testing

WHAT I WILL NOT DO:

- Add any CI/CD configuration
- Modify existing commit message format
- Add other lefthook hooks (only commit-msg)

> Scope is frozen after this section is completed. Any new work discovered must become a new task or a GitHub issue and be listed in "Issues Created" below.

## Plan (ordered steps)

1. Install @commitlint/cli, @commitlint/config-conventional, and lefthook using bun
2. Create commitlint.config.js with conventional commits config
3. Create lefthook.yml with commit-msg hook running commitlint
4. Add lefthook postinstall script to package.json
5. Add commitmsg script to package.json for manual testing
6. Run bun run postinstall to install git hooks
7. Test with a valid commit message
8. Test with invalid commit message to verify it fails

## Implementation Notes

> **⚠️ CRITICAL: Before writing any code, MUST use Context7 to fetch commitlint and lefthook documentation**

**MCPs/Skills to use for this task:**

- **context7**: Fetch commitlint and lefthook documentation for setup

## Verification

- `bun run commitmsg` passes on valid commit message
- Invalid commit message is rejected by hook
- `bunx commitlint --from HEAD~1 --to HEAD` works for manual testing

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

- Use conventional commits format: feat:, fix:, chore:, docs:, style:, refactor:, perf:, test:
- Example: "feat: add user authentication"
- Skip hook during commit with --no-verify (use sparingly)
