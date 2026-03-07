# Drizzle Runbook

This runbook describes the exact commands to install Drizzle tooling, generate schema from Better Auth, and apply migrations.

1. Start local Postgres

```bash
docker compose up -d
```

2. Install packages (example using bun)

```bash
bun add drizzle-orm drizzle-orm pg
bun add -d drizzle-kit
```

3. Verify `POSTGRES_URL` is set in `.env` and accessible

4. Generate Better Auth Drizzle schema (requires `lib/auth.ts` to export `options` or `createAuthOptions`)

```bash
npx @better-auth/cli generate --config ./lib/auth.ts --output ./auth-generated/better-auth-schema.ts
```

5. Merge generated schema into `db/schema.ts` or import it:

```ts
// db/schema.ts
export * from "../auth-generated/better-auth-schema"
```

6. Create and run Drizzle migrations

```bash
npx drizzle-kit generate:migration
npx drizzle-kit migrate:latest
```

7. Verify tables

Connect with psql or use a DB GUI to confirm Better Auth tables are present.

8. Clean up (stop DB)

```bash
docker compose down
```
