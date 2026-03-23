"use client"

import { useTranslations } from "next-intl"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Activity,
  LifeBuoy,
  ScrollText,
  Flag,
  Settings,
  HelpCircle,
  Shield,
  Home,
} from "lucide-react"

import { Link } from "@/lib/navigation"
import { NavMain, NavSecondary, NavUser } from "@/components/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; avatar: string }
}) {
  const tAdmin = useTranslations("admin")
  const tSidebar = useTranslations("sidebar")

  const data = {
    navMain: [
      {
        title: tAdmin("dashboard"),
        url: `/admin`,
        icon: LayoutDashboard,
      },
      {
        title: tAdmin("users"),
        url: `/admin/users`,
        icon: Users,
      },
      {
        title: tAdmin("billing"),
        url: `/admin/billing`,
        icon: CreditCard,
      },
      {
        title: tAdmin("analytics"),
        url: `/admin/analytics`,
        icon: BarChart3,
      },
    ],
    navOperations: [
      {
        title: tAdmin("systemHealth"),
        url: `/admin/system`,
        icon: Activity,
      },
      {
        title: tAdmin("support"),
        url: `/admin/support`,
        icon: LifeBuoy,
      },
    ],
    navManagement: [
      {
        title: tAdmin("auditLog"),
        url: `/admin/audit`,
        icon: ScrollText,
      },
      {
        title: tAdmin("featureFlags"),
        url: `/admin/features`,
        icon: Flag,
      },
    ],
    navSecondary: [
      {
        title: tSidebar("home"),
        url: `/`,
        icon: Home,
      },
      {
        title: tAdmin("settings"),
        url: `/admin/settings`,
        icon: Settings,
      },
      {
        title: tAdmin("getHelp"),
        url: `/admin/help`,
        icon: HelpCircle,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/admin">
                <Shield className="size-5!" />
                <span className="text-base font-semibold">
                  {tAdmin("adminPanel")}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarGroup>
          <SidebarGroupLabel>{tAdmin("operations")}</SidebarGroupLabel>
          <NavMain items={data.navOperations} />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{tAdmin("management")}</SidebarGroupLabel>
          <NavMain items={data.navManagement} />
        </SidebarGroup>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} billingPath="/admin/billing" />
      </SidebarFooter>
    </Sidebar>
  )
}
