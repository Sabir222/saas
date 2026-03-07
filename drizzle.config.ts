import { config as dotenvConfig } from "dotenv"
import { defineConfig } from "drizzle-kit"

dotenvConfig({ path: ".env" })

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  migrations: {
    table: "drizzle_migrations",
  },
})
