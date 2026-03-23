import { Suspense } from "react"
import { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"

import { TwoFactorForm } from "./two-factor-form"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "auth.twoFactor",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function TwoFactorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" />
      }
    >
      <TwoFactorForm />
    </Suspense>
  )
}
