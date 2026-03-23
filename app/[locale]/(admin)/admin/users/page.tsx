"use client"

import { useEffect, useState, useCallback } from "react"
import { authClient } from "@/lib/auth-client"
import { clientLogger } from "@/lib/client-logger"
import { UsersTable } from "./users-table"
import { RoleChangeDialog } from "./role-change-dialog"
import { SessionsDialog } from "./sessions-dialog"
import type { UserWithRole, SessionInfo } from "./types"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [roleDialogUser, setRoleDialogUser] = useState<UserWithRole | null>(
    null
  )

  const [sessionsDialogUser, setSessionsDialogUser] =
    useState<UserWithRole | null>(null)
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)
  const [revokingToken, setRevokingToken] = useState<string | null>(null)
  const [isRevokingAll, setIsRevokingAll] = useState(false)

  const { data: currentSession } = authClient.useSession()

  const loadUsers = useCallback(async () => {
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
      clientLogger.error("Failed to load users", {
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleBanUser = useCallback(
    async (userId: string) => {
      setActionLoading(userId)
      try {
        await authClient.admin.banUser({ userId })
        await loadUsers()
      } catch (error) {
        clientLogger.error("Failed to ban user", {
          error: error instanceof Error ? error.message : String(error),
        })
      } finally {
        setActionLoading(null)
      }
    },
    [loadUsers]
  )

  const handleUnbanUser = useCallback(
    async (userId: string) => {
      setActionLoading(userId)
      try {
        await authClient.admin.unbanUser({ userId })
        await loadUsers()
      } catch (error) {
        clientLogger.error("Failed to unban user", {
          error: error instanceof Error ? error.message : String(error),
        })
      } finally {
        setActionLoading(null)
      }
    },
    [loadUsers]
  )

  const handleImpersonate = useCallback(async (userId: string) => {
    setActionLoading(userId)
    try {
      const { data, error } = await authClient.admin.impersonateUser({
        userId,
      })
      if (error) {
        clientLogger.error("Failed to impersonate user", {
          error: error instanceof Error ? error.message : String(error),
        })
      }
      if (data) {
        // Full reload required to reset all client-side auth state after impersonation
        const currentLocale = window.location.pathname.split("/")[1] || "en"
        window.location.href = `/${currentLocale}/dashboard`
      }
    } catch (error) {
      clientLogger.error("Failed to impersonate user", {
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setActionLoading(null)
    }
  }, [])

  const handleRoleChanged = useCallback(
    async (userId: string, role: string) => {
      try {
        await authClient.admin.setRole({
          userId,
          role: role as "user" | "admin",
        })
        await loadUsers()
      } catch (error) {
        clientLogger.error("Failed to set user role", {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    },
    [loadUsers]
  )

  const loadSessions = useCallback(async (userId: string) => {
    setIsLoadingSessions(true)
    try {
      const { data } = await authClient.admin.listUserSessions({ userId })
      setSessions((data?.sessions as SessionInfo[]) || [])
    } catch (error) {
      clientLogger.error("Failed to load sessions", {
        error: error instanceof Error ? error.message : String(error),
      })
      setSessions([])
    } finally {
      setIsLoadingSessions(false)
    }
  }, [])

  const handleOpenSessionsDialog = useCallback(
    (user: UserWithRole) => {
      setSessionsDialogUser(user)
      loadSessions(user.id)
    },
    [loadSessions]
  )

  const handleRevokeSession = useCallback(
    async (sessionToken: string) => {
      setRevokingToken(sessionToken)
      try {
        await authClient.admin.revokeUserSession({ sessionToken })
        if (sessionsDialogUser) {
          await loadSessions(sessionsDialogUser.id)
        }
      } catch (error) {
        clientLogger.error("Failed to revoke session", {
          error: error instanceof Error ? error.message : String(error),
        })
      } finally {
        setRevokingToken(null)
      }
    },
    [sessionsDialogUser, loadSessions]
  )

  const handleRevokeAllSessions = useCallback(async () => {
    if (!sessionsDialogUser) return
    setIsRevokingAll(true)
    try {
      await authClient.admin.revokeUserSessions({
        userId: sessionsDialogUser.id,
      })
      setSessions([])
    } catch (error) {
      clientLogger.error("Failed to revoke all sessions", {
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setIsRevokingAll(false)
    }
  }, [sessionsDialogUser])

  return (
    <div className="px-4 lg:px-6">
      <UsersTable
        users={users}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        actionLoading={actionLoading}
        currentUserId={currentSession?.user?.id}
        onBanUser={handleBanUser}
        onUnbanUser={handleUnbanUser}
        onImpersonate={handleImpersonate}
        onOpenRoleDialog={(user) => setRoleDialogUser(user)}
        onOpenSessionsDialog={handleOpenSessionsDialog}
      />

      <RoleChangeDialog
        user={roleDialogUser}
        open={!!roleDialogUser}
        onOpenChange={(open) => {
          if (!open) setRoleDialogUser(null)
        }}
        onRoleChanged={handleRoleChanged}
      />

      <SessionsDialog
        user={sessionsDialogUser}
        sessions={sessions}
        open={!!sessionsDialogUser}
        isLoadingSessions={isLoadingSessions}
        revokingToken={revokingToken}
        isRevokingAll={isRevokingAll}
        currentSessionToken={currentSession?.session?.token}
        onOpenChange={(open) => {
          if (!open) {
            setSessionsDialogUser(null)
            setSessions([])
          }
        }}
        onRevokeSession={handleRevokeSession}
        onRevokeAllSessions={handleRevokeAllSessions}
      />
    </div>
  )
}
