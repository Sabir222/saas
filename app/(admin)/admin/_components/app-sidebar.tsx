"use client"

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

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Billing",
      url: "/admin/billing",
      icon: CreditCard,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
  ],
  navOperations: [
    {
      title: "System Health",
      url: "/admin/system",
      icon: Activity,
    },
    {
      title: "Support",
      url: "/admin/support",
      icon: LifeBuoy,
    },
  ],
  navManagement: [
    {
      title: "Audit Log",
      url: "/admin/audit",
      icon: ScrollText,
    },
    {
      title: "Feature Flags",
      url: "/admin/features",
      icon: Flag,
    },
  ],
  navSecondary: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "/admin/help",
      icon: HelpCircle,
    },
  ],
}

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; avatar: string }
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/admin">
                <Shield className="size-5!" />
                <span className="text-base font-semibold">Admin Panel</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <NavMain items={data.navOperations} />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
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
