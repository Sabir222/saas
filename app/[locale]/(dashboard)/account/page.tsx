"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Loader2, Shield, KeyRound, Lock, Copy, Check } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

import { authClient } from "@/lib/auth-client"
import { useChangePasswordSchema } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AccountPage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const { data: session, isPending } = authClient.useSession()
  const changePasswordSchema = useChangePasswordSchema()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [isLoading2FA, setIsLoading2FA] = useState(false)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [passwordPromptValue, setPasswordPromptValue] = useState("")
  const [twoFactorError, setTwoFactorError] = useState("")

  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)
  const [totpURI, setTotpURI] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [savedRecoveryCodes, setSavedRecoveryCodes] = useState(false)
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false)

  const [isAddingPasskey, setIsAddingPasskey] = useState(false)
  const [passkeyError, setPasskeyError] = useState("")
  const [passkeySuccess, setPasskeySuccess] = useState(false)

  useEffect(() => {
    setTwoFactorEnabled(Boolean(session?.user?.twoFactorEnabled))
  }, [session?.user?.twoFactorEnabled])

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
            <Link href={`/${locale}/sign-in`}>
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess(false)

    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach(
        (err: { path: (string | number | symbol)[]; message: string }) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        }
      )
      setPasswordError(
        fieldErrors.confirmPassword ||
          fieldErrors.newPassword ||
          fieldErrors.currentPassword ||
          t("dashboard.account.validationFailed")
      )
      return
    }

    setIsChangingPassword(true)

    const { error } = await authClient.changePassword(
      {
        currentPassword,
        newPassword,
      },
      {
        onSuccess: () => {
          setPasswordSuccess(true)
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
        },
        onError: (ctx) => {
          setPasswordError(
            ctx.error.message || t("dashboard.account.failedToChangePassword")
          )
        },
      }
    )

    if (error) {
      setPasswordError(
        error.message || t("dashboard.account.failedToChangePassword")
      )
    }

    setIsChangingPassword(false)
  }

  const handleToggle2FA = async () => {
    setTwoFactorError("")
    setShowPasswordPrompt(true)
  }

  const handle2FAWithPassword = async () => {
    setTwoFactorError("")
    setIsLoading2FA(true)

    if (twoFactorEnabled) {
      const { error } = await authClient.twoFactor.disable({
        password: passwordPromptValue,
      })
      if (!error) {
        setTwoFactorEnabled(false)
      } else {
        setTwoFactorError(
          error.message || t("dashboard.account.failedToDisable2FA")
        )
      }
    } else {
      const { data, error } = await authClient.twoFactor.enable({
        password: passwordPromptValue,
      })
      if (!error) {
        setTotpURI(data?.totpURI ?? "")
        setBackupCodes(data?.backupCodes ?? [])
        setSavedRecoveryCodes(false)
        setCopiedBackupCodes(false)
        setShowTwoFactorSetup(true)
      } else {
        setTwoFactorError(
          error.message || t("dashboard.account.failedToEnable2FA")
        )
      }
    }

    setShowPasswordPrompt(false)
    setPasswordPromptValue("")
    setIsLoading2FA(false)
  }

  const handleCopyBackupCodes = async () => {
    if (backupCodes.length === 0) {
      return
    }

    try {
      await navigator.clipboard.writeText(backupCodes.join("\n"))
      setCopiedBackupCodes(true)
    } catch {
      setTwoFactorError(t("dashboard.account.couldNotCopy"))
    }
  }

  const handleCloseTwoFactorSetup = () => {
    if (!savedRecoveryCodes) {
      return
    }

    setShowTwoFactorSetup(false)
    setTwoFactorEnabled(true)
  }

  const handleAddPasskey = async () => {
    setPasskeyError("")
    setPasskeySuccess(false)
    setIsAddingPasskey(true)

    try {
      const { error } = await authClient.passkey.addPasskey({
        name: `${user.email}-passkey`,
      })

      if (error) {
        setPasskeyError(
          error.message || t("dashboard.account.failedToAddPasskey")
        )
      } else {
        setPasskeySuccess(true)
      }
    } catch {
      setPasskeyError(t("dashboard.account.failedToAddPasskey"))
    } finally {
      setIsAddingPasskey(false)
    }
  }

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
          <Card>
            <CardHeader>
              <CardTitle>
                {t("dashboard.account.changePassword.title")}
              </CardTitle>
              <CardDescription>
                {t("dashboard.account.changePassword.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                {passwordError && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                    {t("dashboard.account.changePassword.success")}
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">
                    {t("dashboard.account.changePassword.currentPassword")}
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    disabled={isChangingPassword}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">
                    {t("dashboard.account.changePassword.newPassword")}
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isChangingPassword}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">
                    {t("dashboard.account.changePassword.confirmNewPassword")}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isChangingPassword}
                  />
                </div>
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("dashboard.account.changePassword.changeButton")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="two-factor" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("dashboard.account.twoFactorSection.title")}
              </CardTitle>
              <CardDescription>
                {t("dashboard.account.twoFactorSection.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {twoFactorError && (
                <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {twoFactorError}
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted p-3">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {t("dashboard.account.twoFactorSection.title")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {twoFactorEnabled
                        ? t("dashboard.account.twoFactorSection.enabled")
                        : t("dashboard.account.twoFactorSection.disabled")}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={handleToggle2FA}
                  disabled={isLoading2FA || showPasswordPrompt}
                />
              </div>
              {showPasswordPrompt && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="twoFactorPassword">
                    {twoFactorEnabled
                      ? t(
                          "dashboard.account.twoFactorSection.enterPasswordToDisable"
                        )
                      : t(
                          "dashboard.account.twoFactorSection.enterPasswordToEnable"
                        )}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="twoFactorPassword"
                      type="password"
                      value={passwordPromptValue}
                      onChange={(e) => setPasswordPromptValue(e.target.value)}
                      placeholder={t(
                        "dashboard.account.twoFactorSection.passwordPlaceholder"
                      )}
                    />
                    <Button
                      onClick={handle2FAWithPassword}
                      disabled={isLoading2FA || !passwordPromptValue}
                    >
                      {isLoading2FA && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {t("dashboard.account.twoFactorSection.confirm")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordPrompt(false)}
                      disabled={isLoading2FA}
                    >
                      {t("dashboard.account.twoFactorSection.cancel")}
                    </Button>
                  </div>
                </div>
              )}
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">
                {t("dashboard.account.twoFactorSection.enableDescription")}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="passkeys" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("dashboard.account.passkeysSection.title")}
              </CardTitle>
              <CardDescription>
                {t("dashboard.account.passkeysSection.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {passkeyError && (
                <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {passkeyError}
                </div>
              )}
              {passkeySuccess && (
                <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                  {t("dashboard.account.passkeysSection.success")}
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted p-3">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {t("dashboard.account.passkeysSection.subtitle")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("dashboard.account.passkeysSection.usePasskeys")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddPasskey}
                  disabled={isAddingPasskey}
                >
                  {isAddingPasskey ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  {t("dashboard.account.passkeysSection.addPasskey")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={showTwoFactorSetup}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseTwoFactorSetup()
            return
          }

          setShowTwoFactorSetup(true)
        }}
      >
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader className="items-start text-left">
            <AlertDialogTitle>
              {t("dashboard.account.twoFactorSetup.dialogTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.account.twoFactorSetup.dialogDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3 rounded-md border p-4">
              {totpURI ? (
                <QRCodeSVG value={totpURI} size={180} includeMargin />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("dashboard.account.twoFactorSetup.totpError")}
                </p>
              )}
              <p className="text-center text-xs text-muted-foreground">
                {t("dashboard.account.twoFactorSetup.scanHint")}
              </p>
              <p className="w-full overflow-auto rounded bg-muted px-3 py-2 font-mono text-xs">
                {totpURI || t("dashboard.account.twoFactorSetup.noTotpUri")}
              </p>
            </div>

            <div className="rounded-md border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium">
                  {t("dashboard.account.twoFactorSetup.backupCodes")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyBackupCodes}
                  disabled={backupCodes.length === 0}
                >
                  {copiedBackupCodes ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copiedBackupCodes ? t("common.copied") : t("common.copyAll")}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.length > 0 ? (
                  backupCodes.map((backupCode) => (
                    <p
                      key={backupCode}
                      className="rounded bg-muted px-2 py-1 text-center font-mono text-xs"
                    >
                      {backupCode}
                    </p>
                  ))
                ) : (
                  <p className="col-span-2 text-sm text-muted-foreground">
                    {t("dashboard.account.twoFactorSetup.noBackupCodes")}
                  </p>
                )}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={savedRecoveryCodes}
                onChange={(event) =>
                  setSavedRecoveryCodes(event.target.checked)
                }
              />
              {t("dashboard.account.twoFactorSetup.savedCodes")}
            </label>
          </div>

          <AlertDialogFooter className="sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {t("dashboard.account.twoFactorSetup.regenerateHint")}
            </p>
            <Button
              onClick={handleCloseTwoFactorSetup}
              disabled={!savedRecoveryCodes}
            >
              {t("dashboard.account.twoFactorSetup.continueToAccount")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
