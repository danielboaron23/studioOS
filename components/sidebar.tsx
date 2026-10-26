"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FolderOpen,
  ListTodo,
  ChartPie,
  Settings,
  ChevronsUpDown,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const mainNav = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Projects", href: "/projects", icon: FolderOpen },
  { label: "Tasks", href: "/tasks", icon: ListTodo },
]

const secondaryNav = [
  { label: "Analytics", href: "/analytics", icon: ChartPie },
  { label: "Team", href: "/team", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function TeamSwitcher() {
  return (
    <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md text-sm font-semibold">
        D
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
        <span className="truncate font-semibold">Studio OS</span>
        <span className="truncate text-xs text-sidebar-foreground/70">AI Design Studio</span>
      </div>
      <ChevronsUpDown className="size-4 ml-auto" />
    </SidebarMenuButton>
  )
}

function NavGroup({
  items,
  label,
}: {
  items: typeof mainNav
  label: string
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                } tooltip={item.label}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <TeamSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup items={mainNav} label="Platform" />
        <NavGroup items={secondaryNav} label="Studio" />
      </SidebarContent>
    </Sidebar>
  )
}
