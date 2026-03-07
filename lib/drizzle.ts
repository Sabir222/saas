import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing POSTGRES_URL in environment")
}

const pool = new Pool({ connectionString: process.env.POSTGRES_URL })
export const db = drizzle(pool)
export const poolClient = pool
