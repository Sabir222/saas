"use client"

import { useTranslations } from "next-intl"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("common")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <h2 className="text-2xl font-bold">{t("error")}</h2>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        {t("tryAgain")}
      </button>
    </div>
  )
}
