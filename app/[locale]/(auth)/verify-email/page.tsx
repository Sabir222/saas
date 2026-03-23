import { Suspense } from "react"
import { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"

import { VerifyEmailForm } from "./verify-email-form"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "auth.verifyEmail",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

async function LoadingState() {
  const t = await getTranslations("common")

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-muted-foreground">{t("loading")}</div>
    </div>
  )
}

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  return (
    <Suspense fallback={<LoadingState />}>
      <VerifyEmailForm />
    </Suspense>
  )
}
