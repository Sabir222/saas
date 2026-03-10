"use client"

import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Ban, UserX, LogIn, Loader2 } from "lucide-react"

type UserWithRole = {
  id: string
  email: string
  name: string | null
  image: string | null | undefined
  createdAt: Date
  emailVerified: boolean
  banned: boolean
  role: string | null | undefined
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const { data: currentSession } = authClient.useSession()

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const { data } = await authClient.admin.listUsers({
        query: {
          searchField: "email",
          searchOperator: "contains",
          searchValue: searchQuery,
        },
      })
      setUsers((data?.users as UserWithRole[]) || [])
    } catch (error) {
      console.error("Failed to load users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleBanUser(userId: string) {
    setActionLoading(userId)
    try {
      await authClient.admin.banUser({
        userId,
      })
      await loadUsers()
    } catch (error) {
      console.error("Failed to ban user:", error)
    } finally {
      setActionLoading(null)
    }
  }

  async function handleUnbanUser(userId: string) {
    setActionLoading(userId)
    try {
      await authClient.admin.unbanUser({
        userId,
      })
      await loadUsers()
    } catch (error) {
      console.error("Failed to unban user:", error)
    } finally {
      setActionLoading(null)
    }
  }

  async function handleImpersonate(userId: string) {
    setActionLoading(userId)
    try {
      const { data, error } = await authClient.admin.impersonateUser({
        userId,
      })
      if (error) {
        console.error("Failed to impersonate:", error)
        return
      }
      if (data) {
        window.location.href = "/dashboard"
      }
    } catch (error) {
      console.error("Failed to impersonate:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage registered users
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  A list of all registered users in the system
                </CardDescription>
              </div>
              <Input
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email Verified</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={user.image || ""}
                                alt={user.name || ""}
                              />
                              <AvatarFallback>
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user.name || "No name"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.emailVerified ? (
                            <Badge variant="secondary">Verified</Badge>
                          ) : (
                            <Badge variant="outline">Unverified</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.banned ? (
                            <Badge variant="destructive">Banned</Badge>
                          ) : (
                            <Badge variant="outline">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={actionLoading === user.id}
                              >
                                {actionLoading === user.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="h-4 w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleImpersonate(user.id)}
                                disabled={user.id === currentSession?.user?.id}
                              >
                                <LogIn className="mr-2 h-4 w-4" />
                                Impersonate
                              </DropdownMenuItem>
                              {user.banned ? (
                                <DropdownMenuItem
                                  onClick={() => handleUnbanUser(user.id)}
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  Unban User
                                </DropdownMenuItem>
                              ) : (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <Ban className="mr-2 h-4 w-4" />
                                      Ban User
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Ban User
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to ban{" "}
                                        {user.email}? This will prevent them
                                        from signing in.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleBanUser(user.id)}
                                      >
                                        Ban User
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
