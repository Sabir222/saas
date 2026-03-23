import { requireSession } from "@/lib/auth-session"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar"
import { SiteHeader } from "./_components/site-header"
import { ImpersonationBanner } from "@/components/impersonation-banner"
import { EmailVerificationBanner } from "@/components/email-verification-banner"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireSession()

  const user = session.user
  const sidebarUser = {
    name: user.name || "User",
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
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
              <EmailVerificationBanner
                emailVerified={user.emailVerified}
                email={user.email}
              />
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
