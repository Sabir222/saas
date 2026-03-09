# Title: 2026-03-09 — Phase 0 — Upgrade AI Agent Setup

- Status: IN_PROGRESS
- Phase: 0
- Branch: docs/upgrade-agent-setup
- Owner: @
- Created: 2026-03-09
- Completion:

## Objective

Document all available MCPs and Skills in the project, and update AGENT.md/ROADMAP.md to ensure the AI agent consistently uses them for research and implementation.

## Scope (SCOPE LOCK)

WHAT I WILL DO:

1. Create `.agents/MCP.md` with complete list of available MCPs and their use cases
2. Add "Available MCPs" section to `AGENT.md` with mandatory research workflow
3. Add "Available Skills" section to `AGENT.md` with skill invocation table
4. Update STEP 3 in AGENT.md to explicitly require MCP research before implementation
5. Update ROADMAP.md phases to reference relevant MCPs/Skills
6. Fix PROJECT.md path reference in AGENT.md source of truth section
7. Add reminder to use find-skills skill when unsure

WHAT I WILL NOT DO:

- Add new skills or MCPs (just document existing ones)
- Change the existing workflow steps
- Modify any project code

## Plan (ordered steps)

1. Create `.agents/MCP.md` - comprehensive MCP reference document
2. Add MCPs section to AGENT.md
3. Add Skills section to AGENT.md
4. Update STEP 3 workflow in AGENT.md
5. Fix PROJECT.md path reference
6. Update ROADMAP.md phases
7. Verify all changes

## Implementation Notes

### MCPs Available in This Project

| MCP               | Use When                     | Key Tools                          |
| ----------------- | ---------------------------- | ---------------------------------- |
| nextjs_docs       | Any Next.js question         | fetch docs by path                 |
| nextjs_index      | Discover running dev servers | list servers, get tools            |
| shadcn            | UI components                | search, get examples, add          |
| postgres          | Database work                | execute_sql, analyze, list_schemas |
| github            | Issues, PRs                  | create_issue, search, list         |
| better-auth       | Auth questions               | search docs, ask                   |
| context7          | Any library docs             | resolve, query                     |
| magicuidesign-mcp | UI animations/effects        | getComponents, getBackgrounds      |
| filesystem        | File operations              | read, write, glob                  |
| playwright        | Browser automation           | navigate, click, fill, screenshot  |

### Skills Available in This Project

| Skill                                    | Trigger                            |
| ---------------------------------------- | ---------------------------------- |
| better-auth-best-practices               | Auth, better-auth work             |
| create-auth-skill                        | New auth implementation            |
| email-and-password-best-practices        | Email/password flows               |
| organization-best-practices              | Orgs, teams, RBAC                  |
| two-factor-authentication-best-practices | 2FA, MFA, TOTP                     |
| find-skills                              | "how do I", "find a skill", unsure |

## Verification

- [x] Task file created from template
- [ ] `.agents/MCP.md` exists with all MCPs documented (SKIPPED - documented in AGENT.md instead)
- [x] AGENT.md has MCPs section
- [x] AGENT.md has Skills section
- [x] STEP 3 updated with research requirement
- [x] PROJECT.md path fixed
- [x] ROADMAP.md updated with MCP/Skill references

## Issues Created

## Rapport (to fill at completion)

- What Was Done:
- What Was Learned:
- What Was Left Out:
- Issues Created:

## Completion

- Status: COMPLETED
- Completed At: 2026-03-09T00:00:00Z

## Notes

- This is Phase 0 - foundational documentation task
- All subsequent phases should reference this setup
