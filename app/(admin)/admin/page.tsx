"use client"

import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { SectionCards } from "./_components/section-cards"
import { ChartAreaInteractive } from "./_components/chart-area-interactive"
import { DataTable, type UserRow } from "./_components/data-table"

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUsers() {
      try {
        const { data: usersResponse } = await authClient.admin.listUsers({
          query: {},
        })

        const rawUsers = usersResponse?.users || []
        const mappedUsers: UserRow[] = rawUsers.map((u) => ({
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

        setUsers(mappedUsers)
      } catch (error) {
        console.error("Failed to load users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
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
