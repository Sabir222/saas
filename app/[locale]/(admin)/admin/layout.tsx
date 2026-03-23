import { requireSession } from "@/lib/auth-session"
import { setRequestLocale } from "next-intl/server"
import { redirect } from "@/lib/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar"
import { SiteHeader } from "./_components/site-header"
import { ImpersonationBanner } from "@/components/impersonation-banner"

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const session = await requireSession()

  if (session.user.role !== "admin") {
    redirect({ href: "/dashboard", locale })
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
        <ImpersonationBanner session={session} />
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
