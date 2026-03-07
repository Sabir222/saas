// Placeholder schema file for Drizzle. This file will be populated by
// Better Auth CLI `generate` output or by merging generated schema.

import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core"

// Minimal example table to ensure Drizzle compiles.
export const example = pgTable("example", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
})

export const schema = {
  example,
}
