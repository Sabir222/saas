"use client"

import { Loader2, Monitor, Smartphone, Globe, X, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { UserWithRole, SessionInfo } from "./types"

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

export function SessionsDialog({
  user,
  sessions,
  open,
  isLoadingSessions,
  revokingToken,
  isRevokingAll,
  currentSessionToken,
  onOpenChange,
  onRevokeSession,
  onRevokeAllSessions,
}: {
  user: UserWithRole | null
  sessions: SessionInfo[]
  open: boolean
  isLoadingSessions: boolean
  revokingToken: string | null
  isRevokingAll: boolean
  currentSessionToken: string | undefined
  onOpenChange: (open: boolean) => void
  onRevokeSession: (sessionToken: string) => void
  onRevokeAllSessions: () => void
}) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onOpenChange(false)
      }}
    >
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Sessions for {user?.name || user?.email}
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
                const { label, icon: Icon } = parseUserAgent(session.userAgent)
                const isCurrentSession = session.token === currentSessionToken
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
                            <Badge variant="secondary" className="ml-2 text-xs">
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
                      onClick={() => onRevokeSession(session.token)}
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
              onClick={onRevokeAllSessions}
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
  )
}
