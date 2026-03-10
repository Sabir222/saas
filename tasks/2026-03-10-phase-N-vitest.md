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

# Title: 2026-03-10 — Phase N — Add Vitest for Testing

- Status: PENDING
- Phase: N
- Branch: vitest-imp
- Owner: @
- Created: 2026-03-10
- Completion:

## Objective

Add Vitest (latest version) for unit and integration testing in the project.

## Scope (SCOPE LOCK)

WHAT I WILL DO:

- Install vitest (latest version) and @vitest/coverage-v8
- Create vitest.config.ts with appropriate configuration for Next.js
- Add test script to package.json
- Create a sample test file to verify setup works
- Configure test environment (node or happy-dom for Next.js)

WHAT I WILL NOT DO:

- Write extensive tests (just verify setup works)
- Add testing to existing code
- Configure CI/CD

> Scope is frozen after this section is completed. Any new work discovered must become a new task or a GitHub issue and be listed in "Issues Created" below.

## Plan (ordered steps)

1. Check current package.json for existing test dependencies
2. Install vitest (latest) and @vitest/coverage-v8 using bun
3. Create vitest.config.ts with Next.js-appropriate configuration
4. Add test and test:coverage scripts to package.json
5. Create a simple test file to verify setup
6. Run tests to verify everything works
7. Commit and push

## Implementation Notes

> **⚠️ CRITICAL: Before writing any code, MUST use Context7 to fetch vitest documentation**

**MCPs/Skills to use for this task:**

- **context7**: Fetch vitest documentation for latest version setup and configuration
- Check for vitest v3/v4 latest setup requirements
- Look for Next.js specific configuration if needed

## Verification

- `bun run test` runs successfully
- Sample test passes
- No TypeScript errors

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

- Use vitest v4 (latest) if available
- For Next.js, consider using happy-dom or jsdom environment
- Example test: `describe('Math', () => { it('adds', () => { expect(1+1).toBe(2) }) })`
