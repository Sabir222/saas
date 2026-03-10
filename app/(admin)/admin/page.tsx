"use client"

import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Shield, Ban, Activity } from "lucide-react"
import Link from "next/link"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  bannedUsers: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = authClient.useSession()

  useEffect(() => {
    async function loadStats() {
      try {
        const { data: usersResponse } = await authClient.admin.listUsers({
          query: {},
        })

        const users = usersResponse?.users || []
        const totalUsers = users.length
        const bannedUsers = users.filter((u) => u.banned).length

        setStats({
          totalUsers,
          activeUsers: totalUsers - bannedUsers,
          bannedUsers,
        })
      } catch (error) {
        console.error("Failed to load stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  const user = session?.user
  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "A"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your application and users
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered users
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    Non-banned users
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Banned Users
              </CardTitle>
              <Ban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.bannedUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    Banned accounts
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Admin Status
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">App Name:</span>
                  <span>SaaS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Auth:</span>
                  <span className="text-green-500">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database:</span>
                  <span className="text-green-500">Connected</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
