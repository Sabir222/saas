"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
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
import { authClient } from "@/lib/auth-client"

export function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  )
  const [message, setMessage] = useState("")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error")
        setMessage("Invalid verification token")
        return
      }

      const { error } = await authClient.verifyEmail(
        { query: { token } },
        {
          onSuccess: () => {
            setStatus("success")
            setMessage("Your email has been verified successfully!")
          },
          onError: (ctx: { error: { message: string } }) => {
            setStatus("error")
            setMessage(ctx.error.message || "Failed to verify email")
          },
        }
      )

      if (error) {
        setStatus("error")
        setMessage(error.message || "Failed to verify email")
      }
    }

    verifyEmail()
  }, [token])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Verifying Email
            </CardTitle>
            <CardDescription>
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Verification Failed
            </CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-2">
            <Link href="/sign-in" className="w-full">
              <Button variant="outline" className="w-full">
                Go to Sign In
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full">
                Go Home
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
          <CardTitle className="text-2xl font-bold text-green-600">
            Email Verified!
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
          <Link href="/sign-in" className="w-full">
            <Button variant="outline" className="w-full">
              Sign In
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
