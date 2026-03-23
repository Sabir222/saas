# Project Blueprint

## Goal

Recreate this product from scratch as a clean Next.js 16 SaaS boilerplate with Better Auth and the Max feature set, while explicitly excluding multi-tenancy and teams from the initial build.

## Product definition

- Framework: Next.js 16 App Router
- Language: TypeScript
- Package manager: Bun only
- Styling: Tailwind CSS v4
- UI system: Shadcn UI on top of Tailwind and magic UI
- Auth: Better Auth (email/password, social OAuth, magic links, 2FA, passkeys)
- Database: PostgreSQL with Drizzle ORM
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
- T3 env
- Zod:schema validation & type inference
- Knip:finds unsed files and dependencies
- Storybook:isolated UI component development
- Commitlint: enforeces conventional commit messages
- Lefthook: runs linters/test via git hooks
- oPRC:end-to-end type-safe API procedures

- CI/CD support: GitHub Actions, semantic-release, Dependabot, CodeRabbit
- Code coverage: Codecov
- Forms: React Hook Form
- Visual regression testing
- i18n validation: i18n-check for missing translation detection
- Commitizen: standard compliant commit messages
- Bundler Analyzer
- AI coding agent instructions: Claude Code, Codex, Cursor, OpenCode, Copilot
- Performance: Lighthouse score optimization
- Local dev database: PGlite for offline development

## very complexe for later

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
- social auth providers: GitHub, Google, Facebook, Apple, Twitter/X
- magic link (passwordless email) authentication
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
- React Hook Form for type-safe form handling
- accessible form primitives
- empty states, loading states, error states, destructive confirmations
- responsive layouts for mobile, tablet, and desktop
- free minimalist theme included
- maximize Lighthouse score across all pages

### Localization

- locale-aware routes under `src/app/[locale]`
- `next-intl` integration for server and client translations
- English as source locale
- translation namespaces by page and feature
- i18n-check for missing translation detection and validation

### Data and persistence

- Drizzle schema split by domain: auth, billing, app, audit
- generated migrations committed to the repo
- shared DB connection utilities only
- PGlite for offline and local development database
- no parallel DB clients unless strongly justified

### Developer experience

- Bun scripts for dev, lint, types, tests, build, migrations, storybook
- ESLint + strict TypeScript
- Knip dependency checks
- Commitlint + conventional commits
- Lefthook for hooks
- Storybook for UI work
- Commitizen for standard compliant commit messages
- Bundler Analyzer for bundle size inspection
- AI coding agent instructions for Claude Code, Codex, Cursor, OpenCode, Copilot
- VS Code settings, tasks, debug configs, and recommended extensions

### Observability and security

- Sentry for application errors
- Spotlight for local dev error inspection
- LogTape structured logging
- Better Stack ingestion for production logs
- PostHog analytics
- Arcjet bot protection + WAF rules
- Checkly smoke and monitoring checks
- Codecov for code coverage reporting
- Visual regression testing

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
  - social providers: GitHub, Google, Facebook, Apple, Twitter/X
  - magic link (passwordless email) support
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
- `FACEBOOK_CLIENT_ID`
- `FACEBOOK_CLIENT_SECRET`
- `APPLE_CLIENT_ID`
- `APPLE_CLIENT_SECRET`
- `TWITTER_CLIENT_ID`
- `TWITTER_CLIENT_SECRET`

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
- `CODECOV_TOKEN`

### Security env

- `ARCJET_KEY`
