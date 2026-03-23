"use client"

import { useTranslations } from "next-intl"

export default function NotFound() {
  const t = useTranslations("common")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">{t("pageNotFound")}</p>
    </div>
  )
}
