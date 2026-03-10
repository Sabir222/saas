"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Shield, KeyRound, Lock } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AccountPage() {
  const { data: session, isPending } = authClient.useSession()

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

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Signed In</CardTitle>
            <CardDescription>
              Please sign in to view your account settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/sign-in">
              <Button className="w-full">Sign In</Button>
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

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
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
          setPasswordError(ctx.error.message || "Failed to change password")
        },
      }
    )

    if (error) {
      setPasswordError(error.message || "Failed to change password")
    }

    setIsChangingPassword(false)
  }

  const handleToggle2FA = async () => {
    setShowPasswordPrompt(true)
  }

  const handle2FAWithPassword = async () => {
    setIsLoading2FA(true)

    if (twoFactorEnabled) {
      const { error } = await authClient.twoFactor.disable({
        password: passwordPromptValue,
      })
      if (!error) {
        setTwoFactorEnabled(false)
      }
    } else {
      const { error } = await authClient.twoFactor.enable({
        password: passwordPromptValue,
      })
      if (!error) {
        setTwoFactorEnabled(true)
      }
    }

    setShowPasswordPrompt(false)
    setPasswordPromptValue("")
    setIsLoading2FA(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Account Settings</h1>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="mx-auto max-w-4xl">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="two-factor">Two-Factor</TabsTrigger>
            <TabsTrigger value="passkeys">Passkeys</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  View and manage your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <p className="rounded-md border bg-muted/50 px-3 py-2">
                    {user.name || "Not set"}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <p className="rounded-md border bg-muted/50 px-3 py-2">
                    {user.email}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label>Email Verified</Label>
                  <p className="rounded-md border bg-muted/50 px-3 py-2">
                    {user.emailVerified ? "Yes" : "No"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
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
                      Password changed successfully!
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
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
                    <Label htmlFor="newPassword">New Password</Label>
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
                      Confirm New Password
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
                    Change Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="two-factor" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-3">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        {twoFactorEnabled ? "Enabled" : "Disabled"}
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
                      Enter your password to{" "}
                      {twoFactorEnabled ? "disable" : "enable"} 2FA
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="twoFactorPassword"
                        type="password"
                        value={passwordPromptValue}
                        onChange={(e) => setPasswordPromptValue(e.target.value)}
                        placeholder="Your password"
                      />
                      <Button
                        onClick={handle2FAWithPassword}
                        disabled={isLoading2FA || !passwordPromptValue}
                      >
                        {isLoading2FA && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowPasswordPrompt(false)}
                        disabled={isLoading2FA}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                <Separator className="my-4" />
                <p className="text-sm text-muted-foreground">
                  When enabled, you&apos;ll be required to enter a verification
                  code from your authenticator app in addition to your password.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="passkeys" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Passkeys</CardTitle>
                <CardDescription>
                  Manage your passkeys for passwordless authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-3">
                      <KeyRound className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">Passkey Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Use passkeys to sign in without a password
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Lock className="mr-2 h-4 w-4" />
                    Add Passkey
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
