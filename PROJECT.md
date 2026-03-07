# Project Blueprint

## Goal

Recreate this product from scratch as a clean Next.js 16 SaaS boilerplate with Better Auth and the Max feature set, while explicitly excluding multi-tenancy and teams from the initial build.

## Product definition

- Framework: Next.js 16 App Router
- Language: TypeScript
- Package manager: Bun only
- Styling: Tailwind CSS v4
- UI system: Shadcn UI on top of Tailwind
- Auth: Better Auth
- Database: PostgreSQL with Drizzle ORM
- Local database workflow: PGlite for local development, PostgreSQL-compatible production database
- API layer: oRPC for end-to-end type-safe procedures
- Billing: Stripe subscriptions + customer portal + webhook-driven provisioning
- Roles and permissions: Better Auth admin plugin + custom access control
- i18n: next-intl with locale-aware routes
- Analytics: PostHog
- Logging: LogTape + Better Stack
- Error monitoring: Sentry + local Spotlight workflow
- Security: Arcjet
- Testing: Vitest + Playwright
- Component development: Storybook
- CI/CD support: GitHub Actions, semantic-release, Dependabot, CodeRabbit

## Explicitly excluded from v1

- Multi-tenancy
- Teams and organizations
- Better Auth organization plugin
- Team-scoped RBAC
- Tenant-aware billing

## Primary user journeys

- Visitor lands on marketing pages, browses docs/content, and signs up.
- User creates an account with email/password or approved social providers.
- User verifies email, signs in, manages password, enables 2FA, and optionally adds passkeys.
- User lands in an authenticated dashboard.
- User upgrades to a paid plan through Stripe Checkout.
- User manages billing through the Stripe customer portal.
- Admin manages users, bans users, sets roles, and optionally impersonates users.

## Feature set to include

### Core platform

- Next.js 16 App Router project structure
- `src/` layout with route groups and private folders
- `proxy.ts` for lightweight redirects and request filtering only
- shared metadata, sitemap, robots, and JSON-LD support
- absolute imports via `@/`

### Authentication and account system

- Better Auth server instance with Drizzle adapter for PostgreSQL
- Better Auth route handler at `src/app/api/auth/[...all]/route.ts`
- Better Auth React client with `createAuthClient`
- email/password sign up and sign in
- sign out
- email verification
- password reset and change password
- social auth providers: start with GitHub and Google
- 2FA via Better Auth `twoFactor()` plugin
- passkeys via `@better-auth/passkey`
- optional email OTP flow if desired later, but not required for the initial slice
- server-side session reads with `auth.api.getSession({ headers: await headers() })`
- secure checks in server pages, route handlers, and server actions
- optimistic redirect logic in `proxy.ts`

### Authorization and admin

- Better Auth admin plugin
- custom RBAC using `createAccessControl` from `better-auth/plugins/access`
- default app roles such as `admin`, `member`, and `billing`
- permission checks in server actions and route handlers
- admin pages for user listing, role updates, bans, session revocation, and impersonation

### Billing

- Stripe product/price based subscriptions
- checkout session creation on the server
- customer portal session creation on the server
- webhook handling for `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, and subscription lifecycle events
- local billing state persisted in app tables, not inferred from Stripe on every request
- feature gating based on local billing state

### API platform

- oRPC router and procedures under a dedicated route such as `src/app/rpc/[[...rest]]/route.ts`
- server-only caller for RSC and server-side orchestration
- typed browser client for app features that benefit from RPC
- clear split between auth endpoints and business endpoints

### UI foundation

- Shadcn UI as the base component system
- shared design tokens and semantic Tailwind variables
- marketing shell and dashboard shell
- accessible form primitives
- empty states, loading states, error states, destructive confirmations
- responsive layouts for mobile, tablet, and desktop

### Localization

- locale-aware routes under `src/app/[locale]`
- `next-intl` integration for server and client translations
- English as source locale
- translation namespaces by page and feature

### Data and persistence

- Drizzle schema split by domain: auth, billing, app, audit
- generated migrations committed to the repo
- shared DB connection utilities only
- no parallel DB clients unless strongly justified

### Developer experience

- Bun scripts for dev, lint, types, tests, build, migrations, storybook
- ESLint + strict TypeScript
- Knip dependency checks
- Commitlint + conventional commits
- Lefthook for hooks
- Storybook for UI work
- VS Code settings and tasks

### Observability and security

- Sentry for application errors
- Spotlight for local dev error inspection
- LogTape structured logging
- Better Stack ingestion for production logs
- PostHog analytics
- Arcjet bot protection + WAF rules
- Checkly smoke and monitoring checks

## Recommended architecture

### App structure

```text
src/
  app/
    [locale]/
      (marketing)/
      (auth)/
      (dashboard)/
    api/
      auth/[...all]/route.ts
      stripe/webhook/route.ts
    rpc/[[...rest]]/route.ts
  components/
    ui/
    shared/
    auth/
    billing/
    dashboard/
  features/
    auth/
    billing/
    admin/
    rbac/
    settings/
  libs/
    Auth.ts
    AuthClient.ts
    Env.ts
    DB.ts
    Logger.ts
    Arcjet.ts
    Stripe.ts
    ORPC.ts
  models/
    auth/
    billing/
    app/
  server/
    dal/
    services/
    permissions/
    events/
  locales/
  styles/
  utils/
```

## Layering rules

- `app/`: routing, page composition, metadata, route handlers
- `components/`: reusable UI
- `features/`: feature-specific UI and local orchestration
- `libs/`: framework/service configuration singletons
- `server/`: privileged logic, DAL, permission checks, billing sync, admin operations
- `models/`: Drizzle schema and DB types

## Auth architecture

- `src/libs/Auth.ts`
  - `betterAuth(...)`
  - Drizzle adapter with provider `pg`
  - `emailAndPassword.enabled = true`
  - `emailVerification` handlers
  - `sendResetPassword` handler
  - social providers
  - `nextCookies()` as the last plugin for server action cookie handling in Next.js
  - plugins: `admin()`, `twoFactor()`, `passkey()`, and any later safe additions
- `src/libs/AuthClient.ts`
  - `createAuthClient` from `better-auth/react`
  - client plugins for admin, 2FA, and passkeys as needed
- `src/server/dal/Auth.ts`
  - server-only helpers for `getSession`, `requireSession`, `requireRole`, `requirePermission`
- `src/app/api/auth/[...all]/route.ts`
  - `export const { GET, POST } = toNextJsHandler(auth)`

## Authorization architecture

- Use Better Auth admin plugin as the auth-owned role carrier
- Create app permissions in a shared client-safe module, for example:
  - `project`
  - `billing`
  - `admin`
  - `settings`
- Centralize permission checks in server-only permission helpers
- Never rely on UI-only restrictions

## Billing architecture

- Stripe source of truth for subscription events
- App database source of truth for app authorization decisions
- Persist at least:
  - `stripeCustomerId`
  - `stripeSubscriptionId`
  - plan key
  - subscription status
  - current period end
- Webhooks update local billing state
- Dashboard reads local billing tables, not live Stripe calls

## oRPC architecture

- Use route handler based transport in App Router
- Keep router definitions server-owned
- Expose typed client for browser and server caller for RSC/server use
- Favor oRPC for app business logic and typed mutations
- Keep Better Auth on its own `/api/auth/[...all]` handler instead of wrapping auth flows in oRPC

## Shadcn UI architecture

- Install only the components we use
- Keep generated base components in `src/components/ui`
- Wrap complex app-specific versions in feature folders
- Build auth, billing, and admin flows from Shadcn primitives rather than vendor-hosted UIs

## Database model plan

### Better Auth tables

- `user`
- `session`
- `account`
- `verification`
- plugin tables required by 2FA, passkeys, admin, and other enabled plugins

### App tables

- `user_preferences`
- `billing_customer`
- `billing_subscription`
- `billing_event`
- `audit_log`
- any app-domain tables needed by the product

## Environment inventory

### Required base env

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_APP_URL`

### Auth provider env

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### Email env

- `RESEND_API_KEY` or chosen provider equivalent
- `EMAIL_FROM`

### Billing env

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Stripe price IDs per plan

### Observability env

- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_PROJECT`
- `SENTRY_ORGANIZATION`
- `NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN`
- `NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

### Security env

- `ARCJET_KEY`

## Recommended implementation order

1. Scaffold a fresh Next.js 16 + Bun + TypeScript + Tailwind v4 app.
2. Add linting, typing, testing, Storybook, commit tooling, and env validation.
3. Set up PostgreSQL, Drizzle, shared DB utilities, and migrations.
4. Install Better Auth and implement the base auth stack.
5. Generate Better Auth schema and add app-owned auth pages.
6. Add server-side auth DAL and dashboard protection.
7. Add Better Auth admin plugin and custom RBAC.
8. Add Shadcn UI foundation and replace generic UI shells.
9. Add Stripe billing flows and webhook-driven subscription state.
10. Add oRPC for app business logic.
11. Add Sentry, Better Stack, PostHog, Arcjet, and Checkly.
12. Add final polish: SEO, docs, CI, release automation, and deployment guides.

## Non-negotiable implementation rules

- Use Bun for installs and scripts.
- Validate every env var in one typed env module.
- Keep auth checks on the server.
- Keep `proxy.ts` lightweight.
- Do not add multi-tenancy concerns to v1 code shape.
- Do not use vendor-hosted auth UI.
- Keep Drizzle as the only ORM.
- Prefer additive migrations and stable vertical slices.

## Success criteria

- A new repo can be created from scratch following this blueprint.
- The product ships with Better Auth instead of Clerk.
- The boilerplate includes RBAC, Stripe billing, oRPC, and Shadcn UI.
- The initial app is single-tenant but structurally ready for later expansion.
- The repo passes `bun run lint`, `bun run check:types`, `bun run test`, and `bun run build-local`.
