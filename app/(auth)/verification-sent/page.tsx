import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function VerificationSentPage() {
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
            Check your email
          </CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent a verification link to your email address. Please
            check your inbox and click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              try again
            </Link>
          </p>
          <Link href="/sign-in" className="w-full">
            <Button variant="outline" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
