"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2, Shield, Copy, Check } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

import { authClient } from "@/lib/auth-client"
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function TwoFactorManager() {
  const tAccount = useTranslations("dashboard.account")
  const tCommon = useTranslations("common")
  const { data: session } = authClient.useSession()

  const sessionTwoFactor = Boolean(session?.user?.twoFactorEnabled)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(sessionTwoFactor)
  const [isLoading2FA, setIsLoading2FA] = useState(false)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [passwordPromptValue, setPasswordPromptValue] = useState("")
  const [twoFactorError, setTwoFactorError] = useState("")

  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)
  const [totpURI, setTotpURI] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [savedRecoveryCodes, setSavedRecoveryCodes] = useState(false)
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false)

  const handleToggle2FA = () => {
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
        setTwoFactorError(tAccount("failedToDisable2FA"))
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
        setTwoFactorError(tAccount("failedToEnable2FA"))
      }
    }

    setShowPasswordPrompt(false)
    setPasswordPromptValue("")
    setIsLoading2FA(false)
  }

  const handleCopyBackupCodes = async () => {
    if (backupCodes.length === 0) return

    try {
      await navigator.clipboard.writeText(backupCodes.join("\n"))
      setCopiedBackupCodes(true)
    } catch {
      setTwoFactorError(tAccount("couldNotCopy"))
    }
  }

  const handleCloseTwoFactorSetup = () => {
    if (!savedRecoveryCodes) return
    setShowTwoFactorSetup(false)
    setTwoFactorEnabled(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{tAccount("twoFactorSection.title")}</CardTitle>
          <CardDescription>
            {tAccount("twoFactorSection.description")}
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
                  {tAccount("twoFactorSection.title")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {twoFactorEnabled
                    ? tAccount("twoFactorSection.enabled")
                    : tAccount("twoFactorSection.disabled")}
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
                  ? tAccount("twoFactorSection.enterPasswordToDisable")
                  : tAccount("twoFactorSection.enterPasswordToEnable")}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="twoFactorPassword"
                  type="password"
                  value={passwordPromptValue}
                  onChange={(e) => setPasswordPromptValue(e.target.value)}
                  placeholder={tAccount("twoFactorSection.passwordPlaceholder")}
                />
                <Button
                  onClick={handle2FAWithPassword}
                  disabled={isLoading2FA || !passwordPromptValue}
                >
                  {isLoading2FA && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {tAccount("twoFactorSection.confirm")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordPrompt(false)}
                  disabled={isLoading2FA}
                >
                  {tAccount("twoFactorSection.cancel")}
                </Button>
              </div>
            </div>
          )}
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">
            {tAccount("twoFactorSection.enableDescription")}
          </p>
        </CardContent>
      </Card>

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
              {tAccount("twoFactorSetup.dialogTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {tAccount("twoFactorSetup.dialogDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3 rounded-md border p-4">
              {totpURI ? (
                <QRCodeSVG value={totpURI} size={180} includeMargin />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {tAccount("twoFactorSetup.totpError")}
                </p>
              )}
              <p className="text-center text-xs text-muted-foreground">
                {tAccount("twoFactorSetup.scanHint")}
              </p>
              <p className="w-full overflow-auto rounded bg-muted px-3 py-2 font-mono text-xs">
                {totpURI || tAccount("twoFactorSetup.noTotpUri")}
              </p>
            </div>

            <div className="rounded-md border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium">
                  {tAccount("twoFactorSetup.backupCodes")}
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
                  {copiedBackupCodes ? tCommon("copied") : tCommon("copyAll")}
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
                    {tAccount("twoFactorSetup.noBackupCodes")}
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
              {tAccount("twoFactorSetup.savedCodes")}
            </label>
          </div>

          <AlertDialogFooter className="sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {tAccount("twoFactorSetup.regenerateHint")}
            </p>
            <Button
              onClick={handleCloseTwoFactorSetup}
              disabled={!savedRecoveryCodes}
            >
              {tAccount("twoFactorSetup.continueToAccount")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
