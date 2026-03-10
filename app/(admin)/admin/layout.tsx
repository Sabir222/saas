"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = authClient.useSession()

  useEffect(() => {
    async function checkAdmin() {
      if (!session) {
        router.push("/sign-in")
        return
      }

      const { data: hasPermission } = await authClient.admin.hasPermission({
        permissions: {
          user: ["list"],
        },
      })

      if (!hasPermission) {
        router.push("/dashboard")
        return
      }

      setIsAdmin(true)
      setIsLoading(false)
    }

    checkAdmin()
  }, [session, router])

  if (isLoading || !session || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-sidebar">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Admin</h1>
          <nav className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm">
                Users
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Back to Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                authClient.signOut()
              }}
            >
              Sign Out
            </Button>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
