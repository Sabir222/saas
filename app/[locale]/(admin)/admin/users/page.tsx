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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MoreHorizontal,
  Ban,
  UserX,
  LogIn,
  Loader2,
  Shield,
  Monitor,
  Smartphone,
  Globe,
  X,
  RotateCcw,
} from "lucide-react"

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

type SessionInfo = {
  id: string
  token: string
  userAgent?: string | null
  ipAddress?: string | null
  createdAt: Date
  expiresAt: Date
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Set role state
  const [roleDialogUser, setRoleDialogUser] = useState<UserWithRole | null>(
    null
  )
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [isSettingRole, setIsSettingRole] = useState(false)

  // Session state
  const [sessionsDialogUser, setSessionsDialogUser] =
    useState<UserWithRole | null>(null)
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)
  const [revokingToken, setRevokingToken] = useState<string | null>(null)
  const [isRevokingAll, setIsRevokingAll] = useState(false)

  const { data: currentSession } = authClient.useSession()

  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function handleSetRole() {
    if (!roleDialogUser || !selectedRole) return
    setIsSettingRole(true)
    try {
      await authClient.admin.setRole({
        userId: roleDialogUser.id,
        role: selectedRole as "user" | "admin",
      })
      await loadUsers()
      setRoleDialogUser(null)
    } catch (error) {
      console.error("Failed to set role:", error)
    } finally {
      setIsSettingRole(false)
    }
  }

  async function loadSessions(userId: string) {
    setIsLoadingSessions(true)
    try {
      const { data } = await authClient.admin.listUserSessions({
        userId,
      })
      setSessions((data?.sessions as SessionInfo[]) || [])
    } catch (error) {
      console.error("Failed to load sessions:", error)
      setSessions([])
    } finally {
      setIsLoadingSessions(false)
    }
  }

  function handleOpenSessionsDialog(user: UserWithRole) {
    setSessionsDialogUser(user)
    loadSessions(user.id)
  }

  async function handleRevokeSession(sessionToken: string) {
    setRevokingToken(sessionToken)
    try {
      await authClient.admin.revokeUserSession({
        sessionToken,
      })
      if (sessionsDialogUser) {
        await loadSessions(sessionsDialogUser.id)
      }
    } catch (error) {
      console.error("Failed to revoke session:", error)
    } finally {
      setRevokingToken(null)
    }
  }

  async function handleRevokeAllSessions() {
    if (!sessionsDialogUser) return
    setIsRevokingAll(true)
    try {
      await authClient.admin.revokeUserSessions({
        userId: sessionsDialogUser.id,
      })
      setSessions([])
    } catch (error) {
      console.error("Failed to revoke all sessions:", error)
    } finally {
      setIsRevokingAll(false)
    }
  }

  function parseUserAgent(ua?: string | null) {
    if (!ua) return { label: "Unknown device", icon: Monitor }
    const lower = ua.toLowerCase()
    if (
      lower.includes("mobile") ||
      lower.includes("android") ||
      lower.includes("iphone")
    ) {
      return { label: "Mobile", icon: Smartphone }
    }
    if (lower.includes("chrome")) return { label: "Chrome", icon: Globe }
    if (lower.includes("firefox")) return { label: "Firefox", icon: Globe }
    if (lower.includes("safari")) return { label: "Safari", icon: Globe }
    if (lower.includes("edge")) return { label: "Edge", icon: Globe }
    return { label: "Browser", icon: Monitor }
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
    <div className="px-4 lg:px-6">
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
                  <TableHead>Role</TableHead>
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
                      colSpan={6}
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
                        {user.role === "admin" ? (
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            <Shield className="mr-1 h-3 w-3" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
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
                              onClick={() => {
                                setSelectedRole(user.role || "user")
                                setRoleDialogUser(user)
                              }}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenSessionsDialog(user)}
                            >
                              <Monitor className="mr-2 h-4 w-4" />
                              Sessions
                            </DropdownMenuItem>
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
                                      Are you sure you want to ban {user.email}?
                                      This will prevent them from signing in.
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

      {/* Set Role Dialog */}
      <AlertDialog
        open={!!roleDialogUser}
        onOpenChange={(open) => {
          if (!open) setRoleDialogUser(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Role</AlertDialogTitle>
            <AlertDialogDescription>
              Change the role for <strong>{roleDialogUser?.email}</strong>. This
              will affect their access permissions immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSettingRole}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleSetRole()
              }}
              disabled={isSettingRole || !selectedRole}
            >
              {isSettingRole ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sessions Dialog */}
      <AlertDialog
        open={!!sessionsDialogUser}
        onOpenChange={(open) => {
          if (!open) {
            setSessionsDialogUser(null)
            setSessions([])
          }
        }}
      >
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Sessions for{" "}
              {sessionsDialogUser?.name || sessionsDialogUser?.email}
            </AlertDialogTitle>
            <AlertDialogDescription>
              View and manage active sessions. Revoking a session will sign the
              user out of that device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-[50vh] overflow-y-auto">
            {isLoadingSessions ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No active sessions
              </p>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => {
                  const { label, icon: Icon } = parseUserAgent(
                    session.userAgent
                  )
                  const isCurrentSession =
                    session.token === currentSession?.session?.token
                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {label}
                            {isCurrentSession && (
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs"
                              >
                                Current
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.ipAddress || "Unknown IP"} &middot;{" "}
                            {new Date(session.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRevokeSession(session.token)}
                        disabled={
                          revokingToken === session.token || isCurrentSession
                        }
                      >
                        {revokingToken === session.token ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            {sessions.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleRevokeAllSessions}
                disabled={isRevokingAll}
              >
                {isRevokingAll ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="mr-2 h-4 w-4" />
                )}
                Revoke All
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
