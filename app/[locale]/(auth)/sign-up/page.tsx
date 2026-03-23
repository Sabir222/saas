import { Suspense } from "react"
import { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"

import { SignUpForm } from "./sign-up-form"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "auth.signUp",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" />
      }
    >
      <SignUpForm />
    </Suspense>
  )
}
