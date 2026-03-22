"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
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
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
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
        setMessage(t("auth.verifyEmail.invalidToken"))
        return
      }

      const { error } = await authClient.verifyEmail(
        { query: { token } },
        {
          onSuccess: () => {
            setStatus("success")
            setMessage(t("auth.verifyEmail.success"))
          },
          onError: (ctx: { error: { message: string } }) => {
            setStatus("error")
            setMessage(ctx.error.message || t("auth.verifyEmail.failed"))
          },
        }
      )

      if (error) {
        setStatus("error")
        setMessage(error.message || t("auth.verifyEmail.failed"))
      }
    }

    verifyEmail()
  }, [token, t])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {t("auth.verifyEmail.verifying")}
            </CardTitle>
            <CardDescription>
              {t("auth.verifyEmail.verifyingDescription")}
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
              {t("auth.verifyEmail.failed")}
            </CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-2">
            <Link href={`/${locale}/sign-in`} className="w-full">
              <Button variant="outline" className="w-full">
                {t("auth.verifyEmail.goToSignIn")}
              </Button>
            </Link>
            <Link href={`/${locale}`} className="w-full">
              <Button variant="ghost" className="w-full">
                {t("auth.verifyEmail.goHome")}
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
            {t("auth.verifyEmail.verified")}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-2">
          <Link href={`/${locale}/dashboard`} className="w-full">
            <Button className="w-full">{t("landing.goToDashboard")}</Button>
          </Link>
          <Link href={`/${locale}/sign-in`} className="w-full">
            <Button variant="outline" className="w-full">
              {t("common.signIn")}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
