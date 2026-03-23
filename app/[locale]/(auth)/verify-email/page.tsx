"use client"

import { Suspense } from "react"
import { useTranslations } from "next-intl"
import { VerifyEmailForm } from "./verify-email-form"

function LoadingState() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-muted-foreground">{t("common.loading")}</div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerifyEmailForm />
    </Suspense>
  )
}
