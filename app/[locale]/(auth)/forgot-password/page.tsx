import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"

import { ForgotPasswordForm } from "./forgot-password-form"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.forgotPassword" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" />
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  )
}
