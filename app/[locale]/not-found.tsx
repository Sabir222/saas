import { useTranslations } from "next-intl"
import Link from "next/link"

export default function NotFound() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t("common.notFound")}
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-primary hover:underline"
        >
          {t("common.home")}
        </Link>
      </div>
    </div>
  )
}
