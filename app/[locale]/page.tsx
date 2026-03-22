"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ShieldCheck,
  ShieldAlert,
  UserCog,
  Mail,
  ArrowRight,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-16 md:px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {t("landing.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("landing.description")}
          </p>
        </header>

        {isPending ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-sm text-muted-foreground">
                {t("common.loading")}
              </p>
            </CardContent>
          </Card>
        ) : !user ? (
          <Card>
            <CardHeader>
              <CardTitle>{t("landing.notSignedIn")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row">
              <Link href={`/${locale}/sign-in`}>
                <Button>
                  {t("common.signIn")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/${locale}/sign-up`}>
                <Button variant="outline">{t("landing.createAccount")}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {!user.emailVerified && (
              <Card className="border-amber-300 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/30">
                <CardContent className="flex items-start gap-3 py-4">
                  <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-700 dark:text-amber-400" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                      {t("landing.verifyEmail")}
                    </p>
                    <p className="text-sm text-amber-800/90 dark:text-amber-300">
                      {t("landing.verifyEmailDescription")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>{t("landing.currentSession")}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <StatusRow
                  icon={<Mail className="h-4 w-4" />}
                  label={t("common.email")}
                  value={user.email}
                />
                <StatusRow
                  icon={
                    user.emailVerified ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <ShieldAlert className="h-4 w-4" />
                    )
                  }
                  label={t("landing.emailVerified")}
                  value={user.emailVerified ? t("common.yes") : t("common.no")}
                  tone={user.emailVerified ? "ok" : "warn"}
                />
                <StatusRow
                  icon={<UserCog className="h-4 w-4" />}
                  label={t("landing.role")}
                  value={user.role || "user"}
                />
                <StatusRow
                  icon={<ShieldAlert className="h-4 w-4" />}
                  label={t("landing.banned")}
                  value={user.banned ? t("common.yes") : t("common.no")}
                  tone={user.banned ? "warn" : "ok"}
                />
                <StatusRow
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label={t("landing.twoFactorEnabled")}
                  value={user.twoFactorEnabled ? t("common.yes") : t("common.no")}
                />
                <StatusRow
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label={t("landing.userId")}
                  value={user.id}
                />
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}/dashboard`}>
                <Button>{t("landing.goToDashboard")}</Button>
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

function StatusRow({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone?: "default" | "ok" | "warn"
}) {
  const variant =
    tone === "warn" ? "destructive" : tone === "ok" ? "secondary" : "outline"

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <Badge
        variant={variant}
        className="max-w-full truncate align-middle font-mono text-xs"
      >
        {value}
      </Badge>
    </div>
  )
}
