import { pool } from "../lib/drizzle"

const tables = [
  "passkey",
  "two_factor",
  "session",
  "account",
  "verification",
  '"user"',
]

async function main() {
  console.log("Clearing all data from database...")

  await pool.query(
    `TRUNCATE TABLE ${tables.join(", ")} RESTART IDENTITY CASCADE`
  )

  const counts = await pool.query<{ tbl: string; rows: string }>(`
    SELECT 'user' AS tbl, count(*)::text AS rows FROM public.user
    UNION ALL SELECT 'account', count(*)::text FROM public.account
    UNION ALL SELECT 'session', count(*)::text FROM public.session
    UNION ALL SELECT 'verification', count(*)::text FROM public.verification
    UNION ALL SELECT 'two_factor', count(*)::text FROM public.two_factor
    UNION ALL SELECT 'passkey', count(*)::text FROM public.passkey
    ORDER BY tbl;
  `)

  console.log("\nDone. Row counts after truncation:")
  console.table(counts.rows)

  await pool.end()
}

main().catch((err) => {
  console.error("Failed to clear database:", err)
  process.exit(1)
})
