"use client"

import Image from "next/image"
import Link from "next/link"
import logoD from "@/public/assets/Logo-D.png"
import { usePathname } from "next/navigation"
import {
  Home,
  BarChart3,
  Settings,
  ChevronsUpDown,
  FolderOpen,
  ListTodo,
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
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Team", href: "/team", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function TeamSwitcher() {
  return (
    <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary overflow-hidden p-1.5">
        <Image src={logoD} alt="Studio OS" className="size-full object-contain" />
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
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
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
        <NavGroup items={secondaryNav} label="Workspace" />
      </SidebarContent>
    </Sidebar>
  )
}
