"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"

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
import { authClient } from "@/lib/auth-client"
import { forgotPasswordSchema } from "@/lib/schemas"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [emailError, setEmailError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setEmailError("")

    const result = forgotPasswordSchema.safeParse({ email })

    if (!result.success) {
      result.error.issues.forEach(
        (err: { path: (string | number | symbol)[]; message: string }) => {
          if (err.path[0]) {
            setEmailError(err.message)
          }
        }
      )
      setIsLoading(false)
      return
    }

    const { error } = await authClient.requestPasswordReset(
      { email, redirectTo: "/reset-password" },
      {
        onSuccess: () => {
          setSuccess(true)
        },
      }
    )

    if (error) {
      setError(error.message || "Failed to send reset email")
    }
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Check your email
            </CardTitle>
            <CardDescription>
              We have sent a password reset link to your email address.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/sign-in" className="w-full">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot password</CardTitle>
          <CardDescription>
            Enter your email address and we will send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="mb-4 space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              {emailError && (
                <p className="text-sm text-destructive">{emailError}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
