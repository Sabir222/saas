"use client"

import { useTranslations } from "next-intl"
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  Shield,
  User,
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
} from "@/components/ui/sidebar"

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; avatar: string }
}) {
  const t = useTranslations("sidebar")

  const data = {
    navMain: [
      {
        title: t("dashboard"),
        url: `/dashboard`,
        icon: LayoutDashboard,
      },
      {
        title: t("account"),
        url: `/account`,
        icon: User,
      },
    ],
    navSecondary: [
      {
        title: t("home"),
        url: `/`,
        icon: Home,
      },
      {
        title: t("settings"),
        url: `/dashboard`,
        icon: Settings,
      },
      {
        title: t("getHelp"),
        url: `/dashboard`,
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
              <Link href="/dashboard">
                <Shield className="size-5!" />
                <span className="text-base font-semibold">
                  {t("myAccount")}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} billingPath="/dashboard" />
      </SidebarFooter>
    </Sidebar>
  )
}
