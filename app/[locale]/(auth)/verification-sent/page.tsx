import { getTranslations, setRequestLocale } from "next-intl/server"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Mail } from "lucide-react"
import { Link } from "@/lib/navigation"

export default async function VerificationSentPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="pt-4 text-center text-2xl font-bold">
            {t("auth.verificationSent.title")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.verificationSent.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            {t("auth.verificationSent.didntReceive")}{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              {t("auth.verificationSent.tryAgain")}
            </Link>
          </p>
          <Link href="/sign-in" className="w-full">
            <Button variant="outline" className="w-full">
              {t("auth.verificationSent.backToSignIn")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
