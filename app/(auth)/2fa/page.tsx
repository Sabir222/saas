"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type VerificationMethod = "totp" | "backup"

export default function TwoFactorPage() {
  const router = useRouter()

  const [method, setMethod] = useState<VerificationMethod>("totp")
  const [code, setCode] = useState("")
  const [trustDevice, setTrustDevice] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const normalized = code.trim()

    if (!normalized) {
      setError("Please enter your verification code")
      return
    }

    setIsLoading(true)

    if (method === "totp") {
      const { error: verifyError } = await authClient.twoFactor.verifyTotp({
        code: normalized,
        trustDevice,
      })

      if (verifyError) {
        setError(verifyError.message || "Invalid authenticator code")
        setIsLoading(false)
        return
      }
    } else {
      const { error: verifyError } =
        await authClient.twoFactor.verifyBackupCode({
          code: normalized,
          trustDevice,
        })

      if (verifyError) {
        setError(verifyError.message || "Invalid backup code")
        setIsLoading(false)
        return
      }
    }

    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Two-factor verification
          </CardTitle>
          <CardDescription>
            Enter a code from your authenticator app or use a backup code.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleVerify}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 rounded-md border p-1">
              <Button
                type="button"
                variant={method === "totp" ? "default" : "ghost"}
                onClick={() => {
                  setMethod("totp")
                  setCode("")
                  setError("")
                }}
                disabled={isLoading}
              >
                Authenticator
              </Button>
              <Button
                type="button"
                variant={method === "backup" ? "default" : "ghost"}
                onClick={() => {
                  setMethod("backup")
                  setCode("")
                  setError("")
                }}
                disabled={isLoading}
              >
                Backup code
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">
                {method === "totp" ? "Authenticator code" : "Backup code"}
              </Label>
              <Input
                id="code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder={method === "totp" ? "123456" : "XXXX-XXXX"}
                autoComplete="one-time-code"
                disabled={isLoading}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={trustDevice}
                onChange={(event) => setTrustDevice(event.target.checked)}
                disabled={isLoading}
              />
              Trust this device for 30 days
            </label>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify and continue
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Need to use a different account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                Back to sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
