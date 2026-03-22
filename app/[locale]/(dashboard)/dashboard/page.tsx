"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Settings } from "lucide-react"

export default function DashboardPage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const { data: session } = authClient.useSession()

  const user = session?.user
  if (!user) return null

  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <div className="px-4 lg:px-6">
      <div className="grid gap-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        <Card className="@container/card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">{t("dashboard.profile.title")}</CardTitle>
            </div>
            <CardDescription>{t("dashboard.profile.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex gap-2">
                  {user.emailVerified ? (
                    <Badge variant="secondary">{t("dashboard.profile.verified")}</Badge>
                  ) : (
                    <Badge variant="outline">{t("dashboard.profile.unverified")}</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">{t("dashboard.security.title")}</CardTitle>
            </div>
            <CardDescription>{t("dashboard.security.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("dashboard.security.twoFactor")}</span>
              <Badge variant={user.twoFactorEnabled ? "secondary" : "outline"}>
                {user.twoFactorEnabled ? t("dashboard.security.enabled") : t("dashboard.security.disabled")}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("dashboard.security.userId")}</span>
              <span className="font-mono text-xs">
                {user.id.slice(0, 8)}...
              </span>
            </div>
            <Link href={`/${locale}/account`}>
              <Button variant="outline" size="sm" className="w-full">
                {t("dashboard.security.manageSecurity")}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">{t("dashboard.quickActions.title")}</CardTitle>
            </div>
            <CardDescription>{t("dashboard.quickActions.description")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href={`/${locale}/account`}>
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                {t("dashboard.quickActions.accountSettings")}
              </Button>
            </Link>
            <Link href={`/${locale}/account`}>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                {t("dashboard.quickActions.securitySettings")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
