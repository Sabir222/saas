import { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"
import {
  ShieldCheck,
  ShieldAlert,
  UserCog,
  Mail,
  ArrowRight,
} from "lucide-react"

import { Link } from "@/lib/navigation"
import { getSession } from "@/lib/auth-session"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    title: t("title"),
    description: t("description"),
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  const tLanding = await getTranslations("landing")
  const tCommon = await getTranslations("common")
  const session = await getSession()
  const user = session?.user

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar session={session} />

      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-16 md:px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {tLanding("title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {tLanding("description")}
          </p>
        </header>

        {!user ? (
          <Card>
            <CardHeader>
              <CardTitle>{tLanding("notSignedIn")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row">
              <Link href="/sign-in">
                <Button>
                  {tCommon("signIn")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline">{tLanding("createAccount")}</Button>
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
                      {tLanding("verifyEmail")}
                    </p>
                    <p className="text-sm text-amber-800/90 dark:text-amber-300">
                      {tLanding("verifyEmailDescription")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>{tLanding("currentSession")}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <StatusRow
                  icon={<Mail className="h-4 w-4" />}
                  label={tCommon("email")}
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
                  label={tLanding("emailVerified")}
                  value={user.emailVerified ? tCommon("yes") : tCommon("no")}
                  tone={user.emailVerified ? "ok" : "warn"}
                />
                <StatusRow
                  icon={<UserCog className="h-4 w-4" />}
                  label={tLanding("role")}
                  value={user.role || tCommon("defaultRole")}
                />
                <StatusRow
                  icon={<ShieldAlert className="h-4 w-4" />}
                  label={tLanding("banned")}
                  value={user.banned ? tCommon("yes") : tCommon("no")}
                  tone={user.banned ? "warn" : "ok"}
                />
                <StatusRow
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label={tLanding("twoFactorEnabled")}
                  value={user.twoFactorEnabled ? tCommon("yes") : tCommon("no")}
                />
                <StatusRow
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label={tLanding("userId")}
                  value={user.id}
                />
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button>{tLanding("goToDashboard")}</Button>
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
