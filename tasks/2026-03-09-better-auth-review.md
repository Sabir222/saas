<!-- Task template for feature/bug slices. Copy to tasks/YYYY-MM-DD-phase-N-desc.md -->

<system-reminder>
Your operational mode has changed from plan to build.
You are no longer in read-only mode.
You are permitted to make file changes, run shell commands, and utilize your arsenal of tools as needed.
</system-reminder>

# Title: 2026-03-09 — Phase 2 — Better Auth Implementation Review & Audit

- Status: PENDING
- Phase: 2
- Branch: review/better-auth-audit
- Owner: @
- Created: 2026-03-09
- Completion:

## Objective

Thoroughly review and audit the current Better Auth implementation in this project, compare against the latest Better Auth documentation using MCP tools, verify Postgres + Drizzle integration correctness, and provide a detailed analysis with findings and recommendations.

## Scope (SCOPE LOCK)

**WHAT I WILL DO:**

1. Review all existing Better Auth files in the project (`lib/auth.ts`, `lib/auth-client.ts`, `db/schema.ts`, `proxy.ts`, server DAL files, API routes)
2. Use **Better Auth MCP** (required) to fetch latest documentation for all configured plugins
3. Use **Context7 MCP** (required) to fetch latest Drizzle ORM documentation for Postgres
4. Compare current implementation against latest Better Auth best practices
5. Check if all required schema fields for each plugin are present
6. Verify database adapter configuration is optimal for Postgres + Drizzle
7. Identify any issues, missing configurations, or outdated patterns
8. Create a detailed analysis section with findings

**WHAT I WILL NOT DO:**

- Implement fixes (create follow-up tasks if issues found)
- Modify any code (this is a review/audit task only)
- Test the auth flow (just code review and documentation comparison)

## Required MCP Tools

You **MUST** use these MCP tools for this task:

1. **Better Auth MCP** - Use `better-auth_search-better-auth-docs` to query:
   - All configured plugins (admin, twoFactor, passkey)
   - Drizzle adapter configuration
   - Latest version features and changes
   - Session management best practices

2. **Context7 MCP** - Use `context7_query-docs` with library ID `/better-auth/better-auth` and `drizzle-orm/drizzle-orm` to query:
   - Drizzle ORM best practices for Postgres
   - Schema configuration patterns
   - Relation definitions

## Plan (ordered steps)

1. Read all Better Auth related files in the project
2. Query Better Auth MCP for documentation on each configured plugin
3. Query Context7 MCP for Drizzle ORM Postgres best practices
4. Compare current implementation against documentation
5. Check for missing schema fields, incorrect configurations, outdated patterns
6. Document all findings in the Analysis section
7. Create follow-up tasks for any issues found

## Implementation Notes

This is a **review and audit task** - no code changes expected. The goal is to:

- Verify the implementation matches current Better Auth best practices
- Identify any gaps or issues
- Provide recommendations for improvements

## Verification

This task doesn't require code verification. Simply review and document findings.

## Analysis Section (TO BE FILLED BY AI)

**AI Agent must fill in this section with detailed findings:**

### Current Implementation Summary

- List all Better Auth files and their purposes
- List all configured plugins
- List all database tables and their purposes

### Documentation Comparison

For each configured plugin/feature, document:

- What the latest documentation recommends
- What we currently have implemented
- Any gaps or differences

### Issues Found

| #   | Issue | Severity | Description |
| --- | ----- | -------- | ----------- |
| 1   |       |          |             |

### Recommendations

| #   | Recommendation | Priority |
| --- | -------------- | -------- |
| 1   |                |          |

### Follow-up Tasks Needed

List any tasks that should be created based on findings.

## Issues Created

- List any issues discovered that need follow-up

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
