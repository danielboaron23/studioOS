"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { copy } from "./copy"
import { categories, halfHours, weekdays } from "./defaults"
import { SaveBar } from "./save-bar"
import { SectionHeader } from "./section-header"
import type { NotificationChannel, NotificationSettings, Weekday } from "./types"
import { useSectionForm, type SectionFormProps } from "./use-section-form"
import { useUnsavedGuard } from "./use-unsaved-guard"

const n = copy.notifications
/** Email is visible but unavailable in v1 (approved decision 3). */
const channels: {
  id: NotificationChannel
  label: string
  helper: string
  comingSoon?: boolean
}[] = [
  { id: "inApp", label: n.inApp, helper: n.inAppHelper },
  { id: "email", label: n.email, helper: n.emailHelper, comingSoon: true },
]
const dayNames: Record<Weekday, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
}

type QuietField = "quiet-start" | "day-Mon"

function validate(v: NotificationSettings) {
  const q = v.quietHours
  if (!q.enabled) return {}
  return {
    "quiet-start": q.start === q.end ? copy.errors.quietSame : undefined,
    "day-Mon": q.days.length === 0 ? copy.errors.quietNoDays : undefined,
  } satisfies Partial<Record<QuietField, string>>
}

function SwitchRow({
  id,
  label,
  helper,
  badge,
  disabled,
  checked,
  onChange,
}: {
  id: string
  label: string
  helper: string
  badge?: string
  disabled?: boolean
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Label htmlFor={id}>{label}</Label>
          {badge && <Badge variant="secondary">{badge}</Badge>}
        </div>
        <p id={`${id}-desc`} className="text-xs text-muted-foreground">
          {helper}
        </p>
      </div>
      <Switch
        id={id}
        aria-describedby={`${id}-desc`}
        disabled={disabled}
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  )
}

export function NotificationsForm(props: SectionFormProps<NotificationSettings>) {
  const f = useSectionForm<NotificationSettings, QuietField>(props, validate)
  const { dialog } = useUnsavedGuard("notifications", f.dirty, f.discard)
  const d = f.draft
  const q = d.quietHours
  const nextDay = q.end < q.start

  return (
    <div className="space-y-6">
      <SectionHeader title={n.title} description={n.description} />

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">{n.channels}</h3>
        <div className="divide-y rounded-lg border">
          {channels.map((c) => (
            <SwitchRow
              key={c.id}
              id={`channel-${c.id}`}
              label={c.label}
              helper={c.helper}
              badge={c.comingSoon ? n.comingSoon : undefined}
              disabled={c.comingSoon}
              checked={!c.comingSoon && d.channels[c.id]}
              onChange={(v) => f.update({ channels: { ...d.channels, [c.id]: v } })}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium" aria-hidden>
          {n.categories}
        </h3>
        {!d.channels.inApp && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm font-medium">{n.allOffTitle}</p>
            <p className="text-xs text-muted-foreground">{n.allOffBody}</p>
          </div>
        )}
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <caption className="sr-only">{n.categories}</caption>
            <thead>
              <tr className="border-b">
                <th scope="col" className="h-10 px-4 text-left font-medium text-muted-foreground">
                  {n.category}
                </th>
                {channels.map((c) => {
                  const off = c.comingSoon || !d.channels[c.id]
                  return (
                    <th
                      key={c.id}
                      scope="col"
                      className={cn(
                        "h-10 w-20 px-2 text-center font-medium text-muted-foreground sm:w-24",
                        off && "opacity-50"
                      )}
                    >
                      {off ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span tabIndex={0} className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                              {c.label}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {c.comingSoon ? n.emailColumnTooltip : n.inAppColumnTooltip}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        c.label
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <th scope="row" className="px-4 py-3 text-left font-normal">
                    <span className="block">{cat.label}</span>
                    <span className="block text-xs text-muted-foreground">{cat.helper}</span>
                  </th>
                  {channels.map((c) => (
                    <td key={c.id} className="px-2 py-3 text-center">
                      <Checkbox
                        aria-label={`${cat.label}, ${c.label.toLowerCase()}`}
                        disabled={c.comingSoon || !d.channels[c.id]}
                        checked={!c.comingSoon && d.channels[c.id] && d.matrix[cat.id][c.id]}
                        onCheckedChange={(v) =>
                          f.update({
                            matrix: {
                              ...d.matrix,
                              [cat.id]: { ...d.matrix[cat.id], [c.id]: v === true },
                            },
                          })
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border">
        <SwitchRow
          id="quiet-hours"
          label={n.quietHours}
          helper={n.quietHoursHelper}
          checked={q.enabled}
          onChange={(enabled) => f.update({ quietHours: { ...q, enabled } })}
        />
        {q.enabled && (
          <>
            <Separator />
            <div className="flex flex-col gap-6 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-end gap-4">
                  {(["start", "end"] as const).map((key) => (
                    <div key={key} className="flex flex-col gap-2">
                      <Label htmlFor={`quiet-${key}`}>{copy.notifications[key]}</Label>
                      <Select
                        value={q[key]}
                        onValueChange={(v) => f.update({ quietHours: { ...q, [key]: v } })}
                      >
                        <SelectTrigger
                          id={`quiet-${key}`}
                          className="w-28 tabular-nums"
                          aria-invalid={key === "start" && !!f.errors["quiet-start"]}
                          aria-describedby="quiet-start-desc"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {halfHours.map((t) => (
                            <SelectItem key={t} value={t} className="tabular-nums">
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                {f.errors["quiet-start"] ? (
                  <p id="quiet-start-desc" className="text-xs text-destructive">
                    {f.errors["quiet-start"]}
                  </p>
                ) : (
                  nextDay && (
                    <p id="quiet-start-desc" className="text-xs text-muted-foreground">
                      {n.endsNextDay}
                    </p>
                  )
                )}
              </div>
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 text-sm font-medium">{n.days}</legend>
                <div className="flex flex-wrap gap-4">
                  {weekdays.map((day) => (
                    <div key={day} className="flex items-center gap-2">
                      <Checkbox
                        id={`day-${day}`}
                        aria-label={dayNames[day]}
                        aria-invalid={!!f.errors["day-Mon"]}
                        aria-describedby={f.errors["day-Mon"] ? "day-Mon-desc" : undefined}
                        checked={q.days.includes(day)}
                        onCheckedChange={(v) =>
                          f.update({
                            quietHours: {
                              ...q,
                              days: v ? [...q.days, day] : q.days.filter((x) => x !== day),
                            },
                          })
                        }
                      />
                      <Label htmlFor={`day-${day}`} className="font-normal">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
                {f.errors["day-Mon"] && (
                  <p id="day-Mon-desc" className="text-xs text-destructive">
                    {f.errors["day-Mon"]}
                  </p>
                )}
              </fieldset>
            </div>
          </>
        )}
      </section>

      {f.dirty && <SaveBar saving={f.saving} onDiscard={f.discard} onSave={f.save} />}
      {dialog}
    </div>
  )
}
