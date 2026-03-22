"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
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

import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
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
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()

  const data = {
    navMain: [
      {
        title: t("admin.dashboard"),
        url: `/${locale}/admin`,
        icon: LayoutDashboard,
      },
      {
        title: t("admin.users"),
        url: `/${locale}/admin/users`,
        icon: Users,
      },
      {
        title: t("admin.billing"),
        url: `/${locale}/admin/billing`,
        icon: CreditCard,
      },
      {
        title: t("admin.analytics"),
        url: `/${locale}/admin/analytics`,
        icon: BarChart3,
      },
    ],
    navOperations: [
      {
        title: t("admin.systemHealth"),
        url: `/${locale}/admin/system`,
        icon: Activity,
      },
      {
        title: t("admin.support"),
        url: `/${locale}/admin/support`,
        icon: LifeBuoy,
      },
    ],
    navManagement: [
      {
        title: t("admin.auditLog"),
        url: `/${locale}/admin/audit`,
        icon: ScrollText,
      },
      {
        title: t("admin.featureFlags"),
        url: `/${locale}/admin/features`,
        icon: Flag,
      },
    ],
    navSecondary: [
      {
        title: t("sidebar.home"),
        url: `/${locale}`,
        icon: Home,
      },
      {
        title: t("admin.settings"),
        url: `/${locale}/admin/settings`,
        icon: Settings,
      },
      {
        title: t("admin.getHelp"),
        url: `/${locale}/admin/help`,
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
              <a href={`/${locale}/admin`}>
                <Shield className="size-5!" />
                <span className="text-base font-semibold">{t("admin.adminPanel")}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarGroup>
          <SidebarGroupLabel>{t("admin.operations")}</SidebarGroupLabel>
          <NavMain items={data.navOperations} />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t("admin.management")}</SidebarGroupLabel>
          <NavMain items={data.navManagement} />
        </SidebarGroup>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
