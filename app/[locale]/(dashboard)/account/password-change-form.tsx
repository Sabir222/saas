"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { useChangePasswordSchema } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PasswordChangeForm() {
  const t = useTranslations("dashboard.account")
  const changePasswordSchema = useChangePasswordSchema()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess(false)

    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach(
        (err: { path: (string | number | symbol)[]; message: string }) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        }
      )
      setPasswordError(
        fieldErrors.confirmPassword ||
          fieldErrors.newPassword ||
          fieldErrors.currentPassword ||
          t("validationFailed")
      )
      return
    }

    setIsChangingPassword(true)

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
    })

    if (error) {
      setPasswordError(t("failedToChangePassword"))
    } else {
      setPasswordSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }

    setIsChangingPassword(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("changePassword.title")}</CardTitle>
        <CardDescription>{t("changePassword.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {passwordError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
              {t("changePassword.success")}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="currentPassword">
              {t("changePassword.currentPassword")}
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={isChangingPassword}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">
              {t("changePassword.newPassword")}
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isChangingPassword}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">
              {t("changePassword.confirmNewPassword")}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isChangingPassword}
            />
          </div>
          <Button type="submit" disabled={isChangingPassword}>
            {isChangingPassword && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("changePassword.changeButton")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
