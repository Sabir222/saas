"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"

import { Link, useRouter } from "@/lib/navigation"
import { authClient } from "@/lib/auth-client"
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

type VerificationMethod = "totp" | "backup"

export function TwoFactorForm() {
  const t = useTranslations("auth.twoFactor")
  const router = useRouter()

  const [method, setMethod] = useState<VerificationMethod>("totp")
  const [code, setCode] = useState("")
  const [trustDevice, setTrustDevice] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const normalized = code.trim()

    if (!normalized) {
      setError(t("enterCode"))
      return
    }

    setIsLoading(true)

    if (method === "totp") {
      const { error: verifyError } = await authClient.twoFactor.verifyTotp({
        code: normalized,
        trustDevice,
      })

      if (verifyError) {
        setError(t("invalidAuthenticator"))
        setIsLoading(false)
        return
      }
    } else {
      const { error: verifyError } =
        await authClient.twoFactor.verifyBackupCode({
          code: normalized,
          trustDevice,
        })

      if (verifyError) {
        setError(t("invalidBackup"))
        setIsLoading(false)
        return
      }
    }

    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleVerify}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 rounded-md border p-1">
              <Button
                type="button"
                variant={method === "totp" ? "default" : "ghost"}
                onClick={() => {
                  setMethod("totp")
                  setCode("")
                  setError("")
                }}
                disabled={isLoading}
              >
                {t("authenticator")}
              </Button>
              <Button
                type="button"
                variant={method === "backup" ? "default" : "ghost"}
                onClick={() => {
                  setMethod("backup")
                  setCode("")
                  setError("")
                }}
                disabled={isLoading}
              >
                {t("backupCode")}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">
                {method === "totp"
                  ? t("authenticatorCode")
                  : t("backupCodeLabel")}
              </Label>
              <Input
                id="code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder={
                  method === "totp"
                    ? t("authenticatorPlaceholder")
                    : t("backupPlaceholder")
                }
                autoComplete="one-time-code"
                disabled={isLoading}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={trustDevice}
                onChange={(event) => setTrustDevice(event.target.checked)}
                disabled={isLoading}
              />
              {t("trustDevice")}
            </label>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("verifyAndContinue")}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t("differentAccount")}{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                {t("backToSignIn")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
