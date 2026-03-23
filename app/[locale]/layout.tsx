import { NextIntlClientProvider, hasLocale } from "next-intl"
import {
  getMessages,
  setRequestLocale,
  getTranslations,
} from "next-intl/server"
import { notFound } from "next/navigation"
import { Metadata } from "next"

import { routing } from "@/lib/routing"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "landing" })

  return {
    title: {
      template: "%s | SAAS Base",
      default: t("title"),
    },
    description: t("description"),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  // Validate the incoming locale
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
