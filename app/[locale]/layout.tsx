import { Geist, Geist_Mono } from "next/font/google"
import { Locale, NextIntlClientProvider, hasLocale } from "next-intl"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { routing } from "@/lib/routing"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "landing",
  })

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

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        fontSans.variable
      )}
    >
      <body>
        <NextIntlClientProvider>
          <ThemeProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
