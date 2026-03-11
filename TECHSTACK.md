# Tech Stack

> **Important:** When working on this project, use these libraries instead of alternatives. Do not add new libraries without updating this file.

## Available MCPs (Research First)

**MANDATORY**: Before any implementation, research using these MCPs:

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

## Token efficiency

- Skip recaps unless the result is ambiguous or you need more input.

## Available Skills (Invoke When Needed)

| Domain      | Skill                                    | Trigger                            |
| ----------- | ---------------------------------------- | ---------------------------------- |
| Auth        | better-auth-best-practices               | auth, better-auth                  |
| Auth Setup  | create-auth-skill                        | new auth, add auth                 |
| 2FA         | two-factor-authentication-best-practices | 2fa, mfa, totp                     |
| Orgs        | organization-best-practices              | orgs, teams, rbac                  |
| Find Skills | find-skills                              | "how do I", "find a skill", unsure |

**IMPORTANT**: When unsure if a skill exists for a task, invoke the `find-skills` skill to search.

## Authentication

| Library                                                                                    | Description                                                                                                                 |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| [better-auth](https://www.better-auth.com/)                                                | Full-featured authentication framework for TypeScript. Use for all auth (sign-up, sign-in, sessions, OAuth, 2FA, passkeys). |
| [@better-auth/drizzle-adapter](https://www.better-auth.com/docs/database-adapters/drizzle) | Drizzle ORM adapter for better-auth.                                                                                        |
| [@better-auth/passkey](https://www.better-auth.com/docs/plugins/passkey)                   | Passkey plugin for better-auth (WebAuthn/FIDO2).                                                                            |

## Database

| Library                                          | Description                                                     |
| ------------------------------------------------ | --------------------------------------------------------------- |
| [drizzle-orm](https://orm.drizzle.team/)         | TypeScript ORM for PostgreSQL. Use for all database operations. |
| [drizzle-kit](https://orm.drizzle.team/kit-docs) | CLI tool for Drizzle migrations and schema management.          |

## UI & Styling

| Library                                                   | Description                                                 |
| --------------------------------------------------------- | ----------------------------------------------------------- |
| [shadcn/ui](https://ui.shadcn.com/)                       | Re-usable components built with Radix UI and Tailwind CSS.  |
| [radix-ui](https://www.radix-ui.com/)                     | Unstyled, accessible UI component primitives.               |
| [tailwind-merge](https://github.com/dvmi/tailwind-merge)  | Utility to merge Tailwind CSS classes.                      |
| [clsx](https://github.com/lukeed/clsx)                    | Utility for constructing `className` strings conditionally. |
| [class-variance-authority](https://github.com/lukeed/cva) | Utility for creating component variants with class names.   |
| [tw-animate-css](https://github.com/cons一成/animate.css) | CSS animations for Tailwind.                                |
| [lucide-react](https://lucide.dev/)                       | Icon library.                                               |
| [motion](https://motion.dev/)                             | Animation library for React (formerly Framer Motion).       |

## Email

| Library                                         | Description                                 |
| ----------------------------------------------- | ------------------------------------------- |
| [resend](https://resend.com/)                   | Email API for sending transactional emails. |
| [@react-email/components](https://react.email/) | React components for building emails.       |

## Validation

| Library                 | Description                                                      |
| ----------------------- | ---------------------------------------------------------------- |
| [zod](https://zod.dev/) | TypeScript-first schema validation. Use for all form validation. |

## Environment & Config

| Library                                   | Description                                  |
| ----------------------------------------- | -------------------------------------------- |
| [@t3-oss/env-nextjs](https://env.t3.dev/) | Type-safe environment variables for Next.js. |

## Testing

| Library                                                  | Description                   |
| -------------------------------------------------------- | ----------------------------- |
| [vitest](https://vitest.dev/)                            | Unit testing framework.       |
| [@vitest/coverage-v8](https://vitest.dev/guide/coverage) | V8 code coverage for Vitest.  |
| [playwright](https://playwright.dev/)                    | End-to-end testing framework. |

## Development Tools

| Library                                              | Description                                                      |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| [lefthook](https://github.com/evilmartians/lefthook) | Git hooks manager (runs lint/typecheck/knip before commit/push). |
| [knip](https://github.com/webpro-nl/knip)            | Finds unused dependencies, exports, and files.                   |
| [prettier](https://prettier.io/)                     | Code formatter.                                                  |
| [eslint](https://eslint.org/)                        | Linter for JavaScript/TypeScript.                                |

## Logging

| Library                                               | Description                                                                             |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [@logtape/logtape](https://github.com/dahlia/logtape) | Zero-dependency logging library for TypeScript. Use for all logging in the application. |

## Other

| Library                                                   | Description                                   |
| --------------------------------------------------------- | --------------------------------------------- |
| [next-themes](https://github.com/pacocoursey/next-themes) | Theme provider for Next.js (dark/light mode). |
| [dotenv](https://github.com/motdotla/dotenv)              | Loads environment variables from `.env` file. |

---

## Adding New Dependencies

When adding a new library to the project:

1. Add it to the appropriate category above in `TECHSTACK.md`
2. Run `bun add <package>` to install it
3. Update the commit message to mention the update

## Notes

- Use **bun** as the package manager (not npm/yarn/pnpm)
- All environment variables should be defined in `.env` and validated via `@t3-oss/env-nextjs` in `lib/Env.ts`
- Use **zod** for all form/server action validation
- Use **better-auth** for all authentication flows
- Use **drizzle-orm** for all database queries
