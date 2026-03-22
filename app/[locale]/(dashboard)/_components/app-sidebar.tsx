"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  Shield,
  User,
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
        title: t("sidebar.dashboard"),
        url: `/${locale}/dashboard`,
        icon: LayoutDashboard,
      },
      {
        title: t("sidebar.account"),
        url: `/${locale}/account`,
        icon: User,
      },
    ],
    navSecondary: [
      {
        title: t("sidebar.home"),
        url: `/${locale}`,
        icon: Home,
      },
      {
        title: t("sidebar.settings"),
        url: `/${locale}/dashboard`,
        icon: Settings,
      },
      {
        title: t("sidebar.getHelp"),
        url: `/${locale}/dashboard`,
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
              <a href={`/${locale}/dashboard`}>
                <Shield className="size-5!" />
                <span className="text-base font-semibold">{t("sidebar.myAccount")}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
