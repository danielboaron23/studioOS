"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTheme, setTheme, subscribeTheme, getThemeSnapshot } from "@/lib/theme";
import { subscribeSettings, getSettingsSnapshot, getDefaultSettingsSnapshot } from "@/lib/settings-store";

function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => "system");

  function toggle() {
    const current = getTheme();
    const next = current === "light" ? "dark" : current === "dark" ? "system" : "light";
    setTheme(next);
  }

  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <Button variant="ghost" size="icon" onClick={toggle}>
      <Icon className="size-5" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function Header() {
  const settings = useSyncExternalStore(subscribeSettings, getSettingsSnapshot, getDefaultSettingsSnapshot);
  const { displayName: rawDisplayName, role, avatar } = settings.profile;

  const displayName = rawDisplayName && rawDisplayName.trim() ? rawDisplayName : "Hani Buskila";
  
  const initials = displayName
    .split(/\s+/)
    .filter(n => n.length > 0)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />

      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="search" placeholder="Search..." className="pl-9 h-9" />
      </div>

      <div className="flex-1" />

      <ThemeToggle />

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-sm font-medium">{displayName}</span>
          <span className="text-xs text-muted-foreground">{role}</span>
        </div>
        <Avatar size="sm">
          <AvatarImage src={avatar} alt={displayName} />
          <AvatarFallback className="font-bold">{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
