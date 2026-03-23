import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import { env } from "@/lib/Env"
import { logger } from "@/lib/logger"

const globalForDb = globalThis as unknown as { pool: Pool }

export const pool =
  globalForDb.pool ||
  new Pool({
    connectionString: env.POSTGRES_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: true } : false,
  })

if (env.NODE_ENV !== "production") {
  globalForDb.pool = pool
}

pool.on("error", (err) => {
  logger.error("Unexpected database pool error", { error: err.message })
})

export const db = drizzle(pool)
