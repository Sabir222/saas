"use client"

export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { useTranslations } from "next-intl"
import { ResetPasswordForm } from "./reset-password-form"

function LoadingState() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-muted-foreground">{t("common.loading")}</div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
