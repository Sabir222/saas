"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"

import { Link } from "@/lib/navigation"
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
import { useForgotPasswordSchema } from "@/lib/schemas"
import { parseFormErrors } from "@/lib/parse-form-errors"

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword")
  const tc = useTranslations("common")
  const forgotPasswordSchema = useForgotPasswordSchema()
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

    const parsed = parseFormErrors(forgotPasswordSchema, { email })

    if (!parsed.success) {
      setEmailError(parsed.errors.email ?? "")
      setIsLoading(false)
      return
    }

    const { error } = await authClient.requestPasswordReset(
      { email, redirectTo: "/reset-password" },
      {
        onSuccess: () => {
          setSuccess(true)
        },
      }
    )

    if (error) {
      setError(t("failedToSend"))
    }
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {t("checkEmail")}
            </CardTitle>
            <CardDescription>{t("checkEmailDescription")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/sign-in" className="w-full">
              <Button variant="outline" className="w-full">
                {t("backToSignIn")}
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
          <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="mb-4 space-y-2">
              <Label htmlFor="email">{tc("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
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
              {t("sendResetLink")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("rememberPassword")}{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                {t("signInLink")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
