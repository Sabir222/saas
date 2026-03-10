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

# Title: YYYY-MM-DD — Phase N — Add Commitlint for Conventional Commits

- Status: PENDING
- Phase: N
- Branch: feat/phase-N-commitlint
- Owner: @
- Created: YYYY-MM-DD
- Completion:

## Objective

Add commitlint to enforce conventional commits format in the project.

## Scope (SCOPE LOCK)

WHAT I WILL DO:

- Install @commitlint/cli and @commitlint/config-conventional
- Create commitlint.config.ts with conventional commits config
- Add husky for git hooks
- Configure commit-msg hook to validate commit messages
- Verify commits follow conventional format

WHAT I WILL NOT DO:

- Modify any existing code
- Change git history
- Add commitizen or other interactive commit tools

> Scope is frozen after this section is completed. Any new work discovered must become a new task or a GitHub issue and be listed in "Issues Created" below.

## Plan (ordered steps)

1. Install @commitlint/cli, @commitlint/config-conventional, and husky using bun
2. Create commitlint.config.ts with conventional commits configuration
3. Initialize husky and add commit-msg hook
4. Test that invalid commit messages are rejected
5. Test that valid commit messages are accepted

## Implementation Notes

**MCPs/Skills to use for this task:**

- **github**: Search for commitlint best practices
- **filesystem**: To create config files

**Conventional commits format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Testing
- chore: Maintenance

## Verification

- `bun run commitlint --edit` passes for valid commits
- Invalid commit messages are rejected with clear error
- husky commit-msg hook is active

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

- Use conventional commits format
- Consider adding commitlint CI action for PR validation
- Allow types: feat, fix, docs, style, refactor, perf, test, chore, revert
- Set subject case to sentence-case
- Set subject max-length to 72
