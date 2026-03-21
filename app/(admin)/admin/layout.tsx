"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar"
import { SiteHeader } from "./_components/site-header"
import { ImpersonationBanner } from "@/components/impersonation-banner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    async function checkAdmin() {
      if (isPending) return
      if (!session) {
        router.push("/sign-in")
        return
      }

      const { data: hasPermission } = await authClient.admin.hasPermission({
        permissions: {
          user: ["list"],
        },
      })

      if (!hasPermission?.success) {
        router.push("/dashboard")
        return
      }

      setIsAdmin(true)
      setIsLoading(false)
    }

    checkAdmin()
  }, [isPending, session, router])

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

  const user = session.user
  const sidebarUser = {
    name: user.name || "Admin",
    email: user.email || "",
    avatar: user.image || "",
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={sidebarUser} />
      <SidebarInset>
        <ImpersonationBanner />
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
