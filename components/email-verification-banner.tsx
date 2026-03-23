"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { ShieldAlert, MailCheck, Loader2 } from "lucide-react"

export function EmailVerificationBanner({
  emailVerified,
  email,
}: {
  emailVerified: boolean
  email: string
}) {
  const t = useTranslations()
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  )

  if (emailVerified) return null

  async function handleResend() {
    setStatus("sending")
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: "/dashboard",
      })
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50/70 px-4 py-3 text-sm dark:border-amber-900 dark:bg-amber-950/30">
      <ShieldAlert className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <span className="font-medium text-amber-900 dark:text-amber-200">
          {t("landing.verifyEmail")}
        </span>
        <span className="text-amber-800/90 dark:text-amber-300">
          {t("landing.verifyEmailDescription")}
        </span>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={handleResend}
        disabled={status === "sending" || status === "sent"}
        className="shrink-0 border-amber-300 text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-200 dark:hover:bg-amber-900/50"
      >
        {status === "sending" && (
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
        )}
        {status === "sent" && <MailCheck className="mr-1.5 h-3.5 w-3.5" />}
        {status === "sending"
          ? t("common.loading")
          : status === "sent"
            ? t("landing.verifyEmailSent")
            : t("auth.verifyEmail.resend")}
      </Button>
    </div>
  )
}
