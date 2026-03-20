"use client"

import Link from "next/link"
import {
  ShieldCheck,
  ShieldAlert,
  UserCog,
  Mail,
  LogOut,
  ArrowRight,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ThemeToggle />

      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-16 md:px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Auth Test Console
          </h1>
          <p className="text-sm text-muted-foreground">
            Clean testing page for authentication status, role, and verification
            state.
          </p>
        </header>

        {isPending ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-sm text-muted-foreground">
                Loading session...
              </p>
            </CardContent>
          </Card>
        ) : !user ? (
          <Card>
            <CardHeader>
              <CardTitle>Not signed in</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row">
              <Link href="/sign-in">
                <Button>
                  Sign in <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline">Create account</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {!user.emailVerified && (
              <Card className="border-amber-300 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/30">
                <CardContent className="flex items-start gap-3 py-4">
                  <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-700 dark:text-amber-400" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                      Please verify your email address.
                    </p>
                    <p className="text-sm text-amber-800/90 dark:text-amber-300">
                      Sign-in is allowed, but verification is still recommended
                      for account security.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Current Session</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <StatusRow
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={user.email}
                />
                <StatusRow
                  icon={
                    user.emailVerified ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <ShieldAlert className="h-4 w-4" />
                    )
                  }
                  label="Email Verified"
                  value={user.emailVerified ? "Yes" : "No"}
                  tone={user.emailVerified ? "ok" : "warn"}
                />
                <StatusRow
                  icon={<UserCog className="h-4 w-4" />}
                  label="Role"
                  value={user.role || "user"}
                />
                <StatusRow
                  icon={<ShieldAlert className="h-4 w-4" />}
                  label="Banned"
                  value={user.banned ? "Yes" : "No"}
                  tone={user.banned ? "warn" : "ok"}
                />
                <StatusRow
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="Two Factor Enabled"
                  value={user.twoFactorEnabled ? "Yes" : "No"}
                />
                <StatusRow
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="User ID"
                  value={user.id}
                />
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
              <Link href="/account">
                <Button variant="outline">Account</Button>
              </Link>
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button variant="outline">Admin</Button>
                </Link>
              )}
              <Button
                variant="destructive"
                onClick={() =>
                  authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = "/"
                      },
                    },
                  })
                }
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

function StatusRow({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone?: "default" | "ok" | "warn"
}) {
  const variant =
    tone === "warn" ? "destructive" : tone === "ok" ? "secondary" : "outline"

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <Badge
        variant={variant}
        className="max-w-full truncate align-middle font-mono text-xs"
      >
        {value}
      </Badge>
    </div>
  )
}
