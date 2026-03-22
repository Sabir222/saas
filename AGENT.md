# AGENT.md

## Git Conventions

### Git rules

- Never do git operations without direct orders from the user
- And always ask first before doing any git operations if users didnt ask you to.

### Commit Message Format

type(scope): short description

Types: feat, fix, perf, docs, chore, ci, refactor

### Merging

When merging a PR, update the merge commit message to:
type(scope): description (#PR_NUMBER)

The PR number is found in the GitHub URL:
github.com/user/repo/pull/42 ← 42 is the number

#### Examples

feat(auth): add OAuth login (#42)
fix(api): handle null response (#31)
chore(deps): update dependencies (#18)

## Always Use Bun

- Use `bun` for all commands: `bun install`, `bun dev`, `bun run <script>`, `bun run build`, etc.
- Never use `npm`, `yarn`, or `pnpm` for this project.

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **React:** 19
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui v4
- **Auth:** Better Auth (email/password, OAuth, 2FA, passkeys, admin)
- **Database:** PostgreSQL (Docker)
- **ORM:** Drizzle ORM
- **Email:** Resend + React Email
- **Validation:** Zod v4
- **Env:** t3-env (@t3-oss/env-nextjs)
- **Animations:** Motion
- **Icons:** Lucide React
- **Runtime:** Node.js

## Conventions

- Components use `"use client"` when needed.
- Prefer server components by default.
- Zod schemas go in `lib/schemas/`.
- Code react while react 19 new compiler in mind.
