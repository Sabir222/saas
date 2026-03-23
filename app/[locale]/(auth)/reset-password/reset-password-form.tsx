"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { useResetPasswordSchema } from "@/lib/schemas"

export function ResetPasswordForm() {
  const t = useTranslations()
  const router = useRouter()
  const resetPasswordSchema = useResetPasswordSchema()
  const { locale } = useParams<{ locale: string }>()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const result = resetPasswordSchema.safeParse({ password, confirmPassword })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach(
        (err: { path: (string | number | symbol)[]; message: string }) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        }
      )
      setErrors(fieldErrors)
      setIsLoading(false)
      return
    }

    if (!token) {
      setErrors({ form: t("auth.resetPassword.invalidToken") })
      setIsLoading(false)
      return
    }

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    })

    if (error) {
      setErrors({
        form: error.message || t("auth.resetPassword.failedToReset"),
      })
      setIsLoading(false)
    } else {
      router.push(`/${locale}/sign-in`)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {t("auth.resetPassword.invalidTokenTitle")}
            </CardTitle>
            <CardDescription>
              {t("auth.resetPassword.invalidTokenDescription")}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href={`/${locale}/forgot-password`} className="w-full">
              <Button variant="outline" className="w-full">
                {t("auth.resetPassword.requestNewLink")}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {t("auth.resetPassword.title")}
          </CardTitle>
          <CardDescription>
            {t("auth.resetPassword.description")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errors.form && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {errors.form}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">
                {t("auth.resetPassword.newPassword")}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <div className="mb-4 space-y-2">
              <Label htmlFor="confirmPassword">
                {t("auth.resetPassword.confirmPassword")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("auth.resetPassword.resetButton")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("auth.forgotPassword.rememberPassword")}{" "}
              <Link
                href={`/${locale}/sign-in`}
                className="text-primary hover:underline"
              >
                {t("auth.forgotPassword.signInLink")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
