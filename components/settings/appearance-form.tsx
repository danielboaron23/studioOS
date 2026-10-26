"use client"

import { useEffect, useState } from "react"
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { copy } from "./copy"
import { SectionHeader } from "./section-header"
import type { AppearanceSettings, Density, ThemeSetting } from "./types"

const c = copy.appearance
const themes: { value: ThemeSetting; label: string; helper?: string; icon: LucideIcon }[] = [
  { value: "system", label: c.system, helper: c.systemHelper, icon: Monitor },
  { value: "light", label: c.light, icon: Sun },
  { value: "dark", label: c.dark, icon: Moon },
]
const densities: { value: Density; label: string; helper: string }[] = [
  { value: "comfortable", label: c.comfortable, helper: c.comfortableHelper },
  { value: "compact", label: c.compact, helper: c.compactHelper },
]

function applyToDocument(a: AppearanceSettings) {
  const root = document.documentElement
  const dark =
    a.theme === "dark" ||
    (a.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  root.classList.toggle("dark", dark)
  localStorage.setItem("theme", dark ? "dark" : "light")
  root.dataset.density = a.density
  root.dataset.reducedMotion = String(a.reducedMotion)
}

function Option({
  group,
  value,
  label,
  helper,
  icon: Icon,
}: {
  group: string
  value: string
  label: string
  helper?: string
  icon?: LucideIcon
}) {
  const id = `${group}-${value}`
  return (
    <div className="flex items-start gap-3">
      <RadioGroupItem value={value} id={id} aria-describedby={helper ? `${id}-desc` : undefined} />
      <div className="flex flex-col gap-1">
        <Label htmlFor={id} className="font-normal">
          {Icon && <Icon className="size-4 text-muted-foreground" aria-hidden />}
          {label}
        </Label>
        {helper && (
          <p id={`${id}-desc`} className="text-xs text-muted-foreground">
            {helper}
          </p>
        )}
      </div>
    </div>
  )
}

/** Applies and saves instantly; no save bar and no toast (spec decision 7). */
export function AppearanceForm({
  saved,
  onSave,
  apply = true,
}: {
  saved: AppearanceSettings
  onSave?: (value: AppearanceSettings) => void
  /** Design review renders several copies; only the live one touches <html>. */
  apply?: boolean
}) {
  const [value, setValue] = useState(saved)
  const [osReduced, setOsReduced] = useState(false)

  useEffect(() => {
    // matchMedia is browser-only; read after mount to avoid a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOsReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  function change(patch: Partial<AppearanceSettings>) {
    const next = { ...value, ...patch }
    setValue(next)
    onSave?.(next)
    if (apply) applyToDocument(next)
  }

  const compact = value.density === "compact"
  const themeLabel = themes.find((t) => t.value === value.theme)?.label ?? ""
  const densityLabel = densities.find((d) => d.value === value.density)?.label ?? ""

  return (
    <div className="space-y-6">
      <SectionHeader title={c.title} description={c.description} />

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-medium">{c.theme}</legend>
        <RadioGroup
          value={value.theme}
          onValueChange={(theme) => change({ theme: theme as ThemeSetting })}
        >
          {themes.map((t) => (
            <Option key={t.value} group="theme" {...t} />
          ))}
        </RadioGroup>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-medium">{c.density}</legend>
        <RadioGroup
          value={value.density}
          onValueChange={(density) => change({ density: density as Density })}
        >
          {densities.map((d) => (
            <Option key={d.value} group="density" {...d} />
          ))}
        </RadioGroup>
      </fieldset>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="reduced-motion">{c.reducedMotion}</Label>
          <p id="reduced-motion-desc" className="text-xs text-muted-foreground">
            {value.reducedMotion !== osReduced ? c.reducedMotionOverride : c.reducedMotionHelper}
          </p>
        </div>
        <Switch
          id="reduced-motion"
          aria-describedby="reduced-motion-desc"
          checked={value.reducedMotion}
          onCheckedChange={(reducedMotion) => change({ reducedMotion })}
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">{c.preview}</p>
        <Card aria-hidden inert>
          <CardHeader>
            <CardTitle>{c.previewTitle}</CardTitle>
            <CardDescription>{c.previewLine(themeLabel, densityLabel)}</CardDescription>
            <CardAction>
              <Button size="sm" variant="outline" tabIndex={-1}>
                {c.previewAction}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ul className="divide-y rounded-lg border">
              {["Discovery", "Design", "Review"].map((row, i) => (
                <li
                  key={row}
                  className={cn(
                    "flex items-center justify-between px-4 text-sm",
                    compact ? "py-2" : "py-3"
                  )}
                >
                  <span className="font-medium">{row}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{3 - i} tasks</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
