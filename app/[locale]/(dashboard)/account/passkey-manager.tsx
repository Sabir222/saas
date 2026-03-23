"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2, KeyRound, Lock } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function PasskeyManager() {
  const t = useTranslations("dashboard.account")
  const { data: session } = authClient.useSession()

  const [isAddingPasskey, setIsAddingPasskey] = useState(false)
  const [passkeyError, setPasskeyError] = useState("")
  const [passkeySuccess, setPasskeySuccess] = useState(false)

  const handleAddPasskey = async () => {
    setPasskeyError("")
    setPasskeySuccess(false)
    setIsAddingPasskey(true)

    try {
      const { error } = await authClient.passkey.addPasskey({
        name: `${session?.user?.email}-passkey`,
      })

      if (error) {
        setPasskeyError(t("failedToAddPasskey"))
      } else {
        setPasskeySuccess(true)
      }
    } catch {
      setPasskeyError(t("failedToAddPasskey"))
    } finally {
      setIsAddingPasskey(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("passkeysSection.title")}</CardTitle>
        <CardDescription>{t("passkeysSection.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {passkeyError && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {passkeyError}
          </div>
        )}
        {passkeySuccess && (
          <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-600">
            {t("passkeysSection.success")}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-muted p-3">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">{t("passkeysSection.subtitle")}</p>
              <p className="text-sm text-muted-foreground">
                {t("passkeysSection.usePasskeys")}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddPasskey}
            disabled={isAddingPasskey}
          >
            {isAddingPasskey ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lock className="mr-2 h-4 w-4" />
            )}
            {t("passkeysSection.addPasskey")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
