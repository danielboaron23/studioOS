"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Building2, Palette, User, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { copy } from "./copy"

export const settingsSections: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/settings/profile", label: copy.nav.profile, icon: User },
  { href: "/settings/appearance", label: copy.nav.appearance, icon: Palette },
  { href: "/settings/notifications", label: copy.nav.notifications, icon: Bell },
  { href: "/settings/workspace", label: copy.nav.workspace, icon: Building2 },
]

/** 2×2 grid below sm (all four always visible), a row from sm, a vertical list from lg. */
export function SettingsNav({ activeHref, className }: { activeHref?: string; className?: string }) {
  const pathname = usePathname()
  const current = activeHref ?? pathname

  return (
    <nav
      aria-label={copy.nav.label}
      className={cn(
        "grid shrink-0 grid-cols-2 gap-1 sm:flex lg:w-60 lg:flex-col",
        className
      )}
    >
      {settingsSections.map(({ href, label, icon: Icon }) => {
        const active = current === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              active ? "bg-muted text-foreground" : "text-foreground hover:bg-muted/60"
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
