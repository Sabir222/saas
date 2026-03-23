import { getTranslations } from "next-intl/server"
import { Metadata } from "next"

import { TwoFactorForm } from "./two-factor-form"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.twoFactor" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function TwoFactorPage() {
  return <TwoFactorForm />
}
