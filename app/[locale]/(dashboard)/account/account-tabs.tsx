"use client"

import { useTranslations } from "next-intl"

import { authClient } from "@/lib/auth-client"
import { Link } from "@/lib/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PasswordChangeForm } from "./password-change-form"
import { TwoFactorManager } from "./two-factor-manager"
import { PasskeyManager } from "./passkey-manager"

export function AccountTabs() {
  const t = useTranslations()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t("dashboard.account.notSignedIn")}</CardTitle>
            <CardDescription>
              {t("dashboard.account.notSignedInDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/sign-in">
              <Button className="w-full">
                {t("dashboard.account.signIn")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const user = session.user

  return (
    <div className="px-4 lg:px-6">
      <Tabs defaultValue="profile" className="mx-auto max-w-4xl">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            {t("dashboard.account.tabs.profile")}
          </TabsTrigger>
          <TabsTrigger value="password">
            {t("dashboard.account.tabs.password")}
          </TabsTrigger>
          <TabsTrigger value="two-factor">
            {t("dashboard.account.tabs.twoFactor")}
          </TabsTrigger>
          <TabsTrigger value="passkeys">
            {t("dashboard.account.tabs.passkeys")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.account.profileInfo.title")}</CardTitle>
              <CardDescription>
                {t("dashboard.account.profileInfo.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>{t("common.name")}</Label>
                <p className="rounded-md border bg-muted/50 px-3 py-2">
                  {user.name || t("dashboard.account.profileInfo.notSet")}
                </p>
              </div>
              <div className="grid gap-2">
                <Label>{t("common.email")}</Label>
                <p className="rounded-md border bg-muted/50 px-3 py-2">
                  {user.email}
                </p>
              </div>
              <div className="grid gap-2">
                <Label>
                  {t("dashboard.account.profileInfo.emailVerified")}
                </Label>
                <p className="rounded-md border bg-muted/50 px-3 py-2">
                  {user.emailVerified ? t("common.yes") : t("common.no")}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <PasswordChangeForm />
        </TabsContent>

        <TabsContent value="two-factor" className="mt-6">
          <TwoFactorManager />
        </TabsContent>

        <TabsContent value="passkeys" className="mt-6">
          <PasskeyManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
