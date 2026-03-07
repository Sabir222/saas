// This file provides a lightweight, CLI-friendly export so the Better Auth
// CLI can import configuration without pulling runtime-only modules. The
// application can call `initAuth()` at runtime to initialise the adapter and
// Better Auth instance.

// Basic validation for env vars used by the CLI when reading config.
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("Missing environment variable: BETTER_AUTH_SECRET")
}

// Export a plain options object the Better Auth CLI can read to generate a
// Drizzle schema. Keep this intentionally runtime-free (no imports of
// @better-auth/server or db drivers) so `npx @better-auth/cli generate`
// can import this module safely.
export const options = {
  secret: process.env.BETTER_AUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
  },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
}

// Runtime initializer — call this from your application startup to get an
// initialized Better Auth instance. This function dynamically imports
// heavier runtime dependencies so the CLI won't try to load them.
export async function initAuth() {
  if (!process.env.POSTGRES_URL) {
    throw new Error("Missing environment variable: POSTGRES_URL")
  }

  // dynamic imports keep top-level module import cheap for the CLI
  const postgres = await import("pg")
  const { drizzle } = await import("drizzle-orm/node-postgres")
  const { migrate } = await import("drizzle-orm/migrate")
  // `better-auth` package provides the runtime entrypoints
  const { betterAuth } = await import("better-auth")
  // adapter is re-exported by the package under adapters/drizzle
  const { drizzleAdapter } = await import("better-auth/adapters/drizzle")

  const pool = new postgres.Pool({ connectionString: process.env.POSTGRES_URL })
  const db = drizzle(pool)

  const auth = betterAuth({
    adapter: drizzleAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET,
    pages: options.pages,
    session: options.session,
  })

  // apply migrations in development if migrations folder exists
  try {
    // safe-guard: only attempt migrate if drizzle migrations API is present
    if (migrate) {
      await migrate(db, { path: "./migrations" })
    }
  } catch (err) {
    // Log and continue; application may handle migrations differently in prod
    console.error("Migration step failed:", err)
  }

  return auth
}

export default options
