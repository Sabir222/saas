"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UserWithRole } from "./types"

export function RoleChangeDialog({
  user,
  open,
  onOpenChange,
  onRoleChanged,
}: {
  user: UserWithRole | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRoleChanged: (userId: string, role: string) => Promise<void>
}) {
  const [selectedRole, setSelectedRole] = useState("")
  const [isSettingRole, setIsSettingRole] = useState(false)

  const handleSetRole = async () => {
    if (!user || !selectedRole) return
    setIsSettingRole(true)
    try {
      await onRoleChanged(user.id, selectedRole)
      onOpenChange(false)
    } finally {
      setIsSettingRole(false)
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedRole("")
          onOpenChange(false)
        } else if (user) {
          setSelectedRole(user.role || "user")
          onOpenChange(true)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Role</AlertDialogTitle>
          <AlertDialogDescription>
            Change the role for <strong>{user?.email}</strong>. This will affect
            their access permissions immediately.
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
          <AlertDialogCancel disabled={isSettingRole}>Cancel</AlertDialogCancel>
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
  )
}
