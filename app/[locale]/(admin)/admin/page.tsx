import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { logger } from "@/lib/logger"
import { SectionCards } from "./_components/section-cards"
import { ChartAreaInteractive } from "./_components/chart-area-interactive"
import { DataTable, type UserRow } from "./_components/data-table"

export default async function AdminDashboardPage() {
  let users: UserRow[] = []

  try {
    const usersResponse = await auth.api.listUsers({
      query: {},
      headers: await headers(),
    })

    const rawUsers = usersResponse?.users || []
    users = rawUsers.map((u) => ({
      id: u.id,
      name: u.name || "",
      email: u.email,
      emailVerified: u.emailVerified,
      banned: Boolean(u.banned),
      role: u.role || "user",
      createdAt:
        u.createdAt instanceof Date
          ? u.createdAt.toISOString()
          : String(u.createdAt),
    }))
  } catch (error) {
    logger.error("Failed to load admin users", {
      error: error instanceof Error ? error.message : String(error),
    })
  }

  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={users} />
    </>
  )
}
