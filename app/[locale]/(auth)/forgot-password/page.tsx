"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
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
import { forgotPasswordSchema } from "@/lib/schemas"

export default function ForgotPasswordPage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [emailError, setEmailError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setEmailError("")

    const result = forgotPasswordSchema.safeParse({ email })

    if (!result.success) {
      result.error.issues.forEach(
        (err: { path: (string | number | symbol)[]; message: string }) => {
          if (err.path[0]) {
            setEmailError(err.message)
          }
        }
      )
      setIsLoading(false)
      return
    }

    const { error } = await authClient.requestPasswordReset(
      { email, redirectTo: `/${locale}/reset-password` },
      {
        onSuccess: () => {
          setSuccess(true)
        },
      }
    )

    if (error) {
      setError(error.message || t("auth.forgotPassword.failedToSend"))
    }
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {t("auth.forgotPassword.checkEmail")}
            </CardTitle>
            <CardDescription>
              {t("auth.forgotPassword.checkEmailDescription")}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href={`/${locale}/sign-in`} className="w-full">
              <Button variant="outline" className="w-full">
                {t("auth.forgotPassword.backToSignIn")}
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
            {t("auth.forgotPassword.title")}
          </CardTitle>
          <CardDescription>
            {t("auth.forgotPassword.description")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="mb-4 space-y-2">
              <Label htmlFor="email">{t("common.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth.forgotPassword.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              {emailError && (
                <p className="text-sm text-destructive">{emailError}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("auth.forgotPassword.sendResetLink")}
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
