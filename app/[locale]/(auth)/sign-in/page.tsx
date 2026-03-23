import { getTranslations } from "next-intl/server"
import { Metadata } from "next"

import { SignInForm } from "./sign-in-form"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.signIn" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function SignInPage() {
  return <SignInForm />
}
