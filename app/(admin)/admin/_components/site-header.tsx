"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeLabels: Record<string, string> = {
  admin: "Dashboard",
  users: "Users",
  billing: "Billing",
  analytics: "Analytics",
  system: "System Health",
  support: "Support",
  audit: "Audit Log",
  features: "Feature Flags",
}

export function SiteHeader() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => ({
    label: routeLabels[segment] || segment,
    href: "/" + segments.slice(0, index + 1).join("/"),
    isLast: index === segments.length - 1,
  }))

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={crumb.href}>
                {crumb.isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
