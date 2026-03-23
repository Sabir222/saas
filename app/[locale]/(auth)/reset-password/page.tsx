import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { Metadata } from "next"

import { ResetPasswordForm } from "./reset-password-form"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.resetPassword" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

async function LoadingState() {
  const t = await getTranslations()

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
