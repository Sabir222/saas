# Roadmap

## Goal 1 - Foundation and tooling

### Scope

- Create a fresh Next.js 16 App Router project with TypeScript, Tailwind v4, and Bun.
- Add ESLint, Vitest, Playwright, Storybook, Commitlint, Lefthook, Knip, and semantic-release.
- Set up typed env validation and base project structure.

### Progress

- Completed:

- In progress:
- Better Auth base stack is wired with Drizzle/Postgres, API route, client helper, DB health check, and server-side auth DAL helpers.

- Next steps:
  1. Scaffold the base app and repo tooling.
  2. Add env validation and project folders.

## Goal 2 - Database and persistence foundation

### Scope

- Configure PostgreSQL, Drizzle ORM, shared DB connection utilities, and migration workflow.
- Keep local development simple with PGlite-compatible workflow.

### Progress

- Completed:

- In progress:

- Next steps:
  1. Add Drizzle config and base schema modules.
  2. Add migration scripts and local DB workflow.

## Goal 3 - Better Auth foundation

### Scope

- Install Better Auth, configure server and client, add auth route handler, and enable core email/password flows.
- Add email verification, password reset, social login providers, and server-side session helpers.

### Progress

- Completed:

- In progress:

- Next steps:
  1. Create `Auth.ts`, `AuthClient.ts`, and `/api/auth/[...all]/route.ts`.
  2. Add Better Auth plugins and env wiring.
  3. Generate schema and add migrations.

## Goal 4 - App-owned auth UI and secure dashboard access

### Scope

- Build sign-in, sign-up, forgot-password, reset-password, verify-email, account settings, and sign-out flows.
- Add a server-side auth DAL and secure dashboard pages.

### Progress

- Completed:

- In progress:

- Next steps:
  1. Create auth pages and forms.
  2. Add server-side `requireSession` helpers.
  3. Keep `proxy.ts` limited to optimistic redirects.

## Goal 5 - RBAC and admin operations

### Scope

- Add Better Auth admin plugin, custom access control, roles, permission helpers, and admin UX.

### Progress

- Completed:

- In progress:

- Next steps:
  1. Define permission statements and roles.
  2. Wire server and client admin plugins.
  3. Add admin user management pages and secure operations.

## Goal 6 - Shadcn UI foundation

### Scope

- Install the required Shadcn UI components and define the design tokens, shells, and shared component patterns.

### Progress

- Completed:

- In progress:

- Next steps:
  1. Initialize Shadcn UI.
  2. Build marketing shell, auth shell, and dashboard shell.
  3. Standardize forms, dialogs, tables, and feedback states.

## Goal 7 - Stripe billing

### Scope

- Add Stripe subscriptions, Checkout, customer portal, webhooks, and local billing state.

### Progress

- Completed:

- In progress:

- Next steps:
  1. Add Stripe server client and env validation.
  2. Add checkout and portal route handlers/server actions.
  3. Add webhook handling and billing tables.
  4. Gate premium features based on local billing state.

## Goal 8 - oRPC application API

### Scope

- Add oRPC router, transport route, server caller, and typed client.

### Progress

- Completed:

- In progress:

- Next steps:
  1. Create base router and procedure patterns.
  2. Add App Router route handler transport.
  3. Expose browser client and server caller utilities.

## Goal 9 - Internationalization

### Scope

- Add locale-aware routes, `next-intl`, and translation workflows.

### Progress

- Completed:

- In progress:

- Next steps:
  1. Add locale routing and messages.
  2. Make auth, billing, and dashboard copy translatable.

## Goal 10 - Observability and security

### Scope

- Add Sentry, Spotlight, Better Stack, PostHog, Arcjet, and Checkly.

### Progress

- Completed:

- In progress:

- Next steps:
  1. Add error monitoring and logging.
  2. Add analytics.
  3. Add Arcjet protections and production monitoring checks.

## Goal 11 - Production hardening and docs

### Scope

- Finalize CI, deployment docs, release automation, SEO defaults, and polish.

### Progress

- Completed:

- In progress:

- Next steps:
  1. Add production checklists.
  2. Finalize docs and deployment instructions.
  3. Run full verification matrix.
