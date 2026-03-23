"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Link } from "@/lib/navigation"
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
  const tVerify = useTranslations("auth.verifyEmail")
  const tLanding = useTranslations("landing")
  const tCommon = useTranslations("common")
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
        setMessage(tVerify("invalidToken"))
        return
      }

      const { error } = await authClient.verifyEmail(
        { query: { token } },
        {
          onSuccess: () => {
            setStatus("success")
            setMessage(tVerify("success"))
          },
          onError: () => {
            setStatus("error")
            setMessage(tVerify("failed"))
          },
        }
      )

      if (error) {
        setStatus("error")
        setMessage(tVerify("failed"))
      }
    }

    verifyEmail()
  }, [token, tVerify])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {tVerify("verifying")}
            </CardTitle>
            <CardDescription>{tVerify("verifyingDescription")}</CardDescription>
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
              {tVerify("failed")}
            </CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-2">
            <Link href="/sign-in" className="w-full">
              <Button variant="outline" className="w-full">
                {tVerify("goToSignIn")}
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full">
                {tVerify("goHome")}
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
            {tVerify("verified")}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full">{tLanding("goToDashboard")}</Button>
          </Link>
          <Link href="/sign-in" className="w-full">
            <Button variant="outline" className="w-full">
              {tCommon("signIn")}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
