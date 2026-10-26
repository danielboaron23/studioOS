"use client"

import { useRef, useState } from "react"
import { MoreHorizontal, Users, X } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { copy } from "./copy"
import { getInitials } from "./defaults"
import { FormField } from "./form-field"
import { ImageField } from "./image-field"
import { logoRules } from "./image-upload"
import { SaveBar } from "./save-bar"
import { SectionHeader } from "./section-header"
import type { FieldErrors, WorkspaceMember, WorkspaceSettings } from "./types"
import { useSectionForm, type SectionFormProps } from "./use-section-form"
import { useUnsavedGuard } from "./use-unsaved-guard"

const c = copy.workspace
type Details = Omit<WorkspaceSettings, "members">
export type WorkspaceField = "logo" | "ws-name" | "slug"

const EMAIL = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
}

function validate(d: Details): FieldErrors<WorkspaceField> {
  const name = d.name.trim()
  return {
    "ws-name": !name
      ? copy.errors.workspaceEmpty
      : name.length < 2
        ? copy.errors.nameShort
        : name.length > 60
          ? copy.errors.nameLong
          : undefined,
    slug:
      d.slug.length < 3 || d.slug.length > 40
        ? copy.errors.slugLength
        : !SLUG.test(d.slug)
          ? copy.errors.slugChars
          : undefined,
  }
}

const details = ({ name, slug, logo }: WorkspaceSettings): Details => ({ name, slug, logo })

export interface Chip {
  email: string
  valid: boolean
}

export interface WorkspaceFormProps
  extends SectionFormProps<WorkspaceSettings, WorkspaceField> {
  /** Design-review hooks for the invite field and remove dialog. */
  initialChips?: Chip[]
  initialAlready?: string[]
  initialRemoveId?: string
  initialMenuId?: string
}

export function WorkspaceForm({
  saved,
  onSave,
  initialDraft,
  initialErrors,
  forceSaving,
  initialChips = [],
  initialAlready = [],
  initialRemoveId,
  initialMenuId,
}: WorkspaceFormProps) {
  // Name/slug/logo go through the save bar; invite/remove apply immediately
  // (approved copy decision 3), so members live outside the draft.
  const [members, setMembers] = useState(saved.members)
  const f = useSectionForm<Details, WorkspaceField>(
    {
      saved: details(saved),
      onSave: (d) => onSave?.({ ...d, members }),
      initialDraft: initialDraft && details(initialDraft),
      initialErrors,
      forceSaving,
    },
    validate
  )
  const { dialog } = useUnsavedGuard("workspace", f.dirty, f.discard)
  const [slugTouched, setSlugTouched] = useState(saved.slug !== slugify(saved.name))
  const d = f.draft

  function commitMembers(next: WorkspaceMember[]) {
    setMembers(next)
    onSave?.({ ...details(saved), members: next })
  }

  return (
    <div className="space-y-6">
      <SectionHeader title={c.title} description={c.description} />

      <FormField id="ws-name" label={c.name} error={f.errors["ws-name"]} required>
        <Input
          className="max-w-sm"
          placeholder={c.namePlaceholder}
          value={d.name}
          onChange={(e) =>
            f.update({
              name: e.target.value,
              ...(slugTouched ? {} : { slug: slugify(e.target.value) }),
            })
          }
          onBlur={() => f.check("ws-name")}
        />
      </FormField>

      <FormField id="slug" label={c.slug} helper={c.slugHelper} error={f.errors.slug} required>
        <Input
          className="max-w-sm font-mono"
          placeholder={c.slugPlaceholder}
          value={d.slug}
          onChange={(e) => {
            setSlugTouched(true)
            f.update({ slug: e.target.value })
          }}
          onBlur={() => f.check("slug")}
        />
      </FormField>

      <ImageField
        id="logo"
        label={c.logo}
        helper={c.logoHelper}
        uploadLabel={c.uploadLogo}
        removeLabel={c.remove}
        removeAria={c.removeAria}
        processingLabel={copy.profile.processing}
        emptyAria={c.logoEmptyAria}
        imageAlt=""
        value={d.logo}
        fallback={d.name.trim().charAt(0).toUpperCase()}
        shape="square"
        rules={logoRules}
        error={f.errors.logo}
        onChange={(logo) => f.update({ logo })}
        onError={(e) => f.setError("logo", e)}
      />

      <InviteField
        members={members}
        initialChips={initialChips}
        initialAlready={initialAlready}
        onInvite={(emails) => {
          const invited: WorkspaceMember[] = emails.map((email, i) => ({
            id: `inv-${Date.now()}-${i}`,
            name: email,
            email,
            status: "invited",
          }))
          commitMembers([...members, ...invited])
          toast.success(c.invitedToast(emails.length, emails[0]))
        }}
      />

      <MembersList
        members={members}
        initialRemoveId={initialRemoveId}
        initialMenuId={initialMenuId}
        onRemove={(m) => {
          commitMembers(members.filter((x) => x.id !== m.id))
          toast.success(
            m.status === "invited" ? c.canceledToast(m.email) : c.removedToast(m.name)
          )
        }}
      />

      {f.dirty && <SaveBar saving={f.saving} onDiscard={f.discard} onSave={f.save} />}
      {dialog}
    </div>
  )
}

function InviteField({
  members,
  initialChips,
  initialAlready,
  onInvite,
}: {
  members: WorkspaceMember[]
  initialChips: Chip[]
  initialAlready: string[]
  onInvite: (emails: string[]) => void
}) {
  const [chips, setChips] = useState<Chip[]>(initialChips)
  const [already, setAlready] = useState<string[]>(initialAlready)
  const [text, setText] = useState("")
  const input = useRef<HTMLInputElement>(null)
  const invalid = chips.some((x) => !x.valid)
  const disabled = chips.length === 0 || invalid

  function commit(raw: string) {
    const parts = raw.split(/[\s,]+/).map((s) => s.trim().toLowerCase()).filter(Boolean)
    if (!parts.length) return
    const existing = new Set(members.map((m) => m.email.toLowerCase()))
    const next = [...chips]
    const dupes: string[] = []
    for (const email of parts) {
      if (existing.has(email)) dupes.push(email)
      else if (!next.some((x) => x.email === email)) next.push({ email, valid: EMAIL.test(email) })
    }
    setChips(next)
    setAlready(dupes)
    setText("")
  }

  const invite = (
    <Button
      variant="default"
      disabled={disabled}
      onClick={() => {
        onInvite(chips.map((x) => x.email))
        setChips([])
        setAlready([])
      }}
    >
      {c.inviteButton}
    </Button>
  )

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="invite">{c.invite}</Label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div
          className={cn(
            "flex min-h-9 flex-1 flex-wrap items-center gap-1 rounded-md border border-input bg-transparent px-2 py-1 shadow-xs transition-[color,box-shadow] dark:bg-input/30",
            "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
            invalid && "border-destructive"
          )}
          onClick={() => input.current?.focus()}
        >
          {chips.map((chip) => {
            const badge = (
              <Badge
                key={chip.email}
                variant={chip.valid ? "secondary" : "destructive"}
                className="max-w-48 gap-1 pr-1"
              >
                <span className="truncate">{chip.email}</span>
                <button
                  type="button"
                  aria-label={c.removeEmail(chip.email)}
                  className="rounded-sm opacity-70 outline-none hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50"
                  onClick={(e) => {
                    e.stopPropagation()
                    setChips(chips.filter((x) => x.email !== chip.email))
                  }}
                >
                  <X className="size-3" aria-hidden />
                </button>
              </Badge>
            )
            return (
              <Tooltip key={chip.email}>
                <TooltipTrigger asChild>{badge}</TooltipTrigger>
                <TooltipContent>{chip.valid ? chip.email : c.invalidEmail}</TooltipContent>
              </Tooltip>
            )
          })}
          <input
            ref={input}
            id="invite"
            aria-describedby="invite-desc"
            className="h-7 min-w-32 flex-1 bg-transparent px-1 text-base outline-none placeholder:text-muted-foreground md:text-sm"
            placeholder={chips.length ? "" : c.invitePlaceholder}
            value={text}
            onChange={(e) => {
              const v = e.target.value
              if (/[\s,]$/.test(v)) commit(v)
              else setText(v)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                commit(text)
              } else if (e.key === "Backspace" && !text && chips.length) {
                setChips(chips.slice(0, -1))
              }
            }}
            onBlur={() => commit(text)}
            onPaste={(e) => {
              e.preventDefault()
              commit(text + e.clipboardData.getData("text"))
            }}
          />
        </div>
        {invalid ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-flex rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                {invite}
              </span>
            </TooltipTrigger>
            <TooltipContent>{c.inviteDisabledTooltip}</TooltipContent>
          </Tooltip>
        ) : (
          invite
        )}
      </div>
      <div id="invite-desc" className="flex flex-col gap-1">
        {already.map((email) => (
          <p key={email} className="text-xs text-destructive">
            {c.alreadyMember(email)}
          </p>
        ))}
        <p className="text-xs text-muted-foreground">{c.inviteHelper}</p>
      </div>
    </div>
  )
}

function AccessCell({ m }: { m: WorkspaceMember }) {
  if (m.status === "invited") return <Badge variant="secondary">{c.invited}</Badge>
  return <span>{m.status === "owner" ? c.owner : c.member}</span>
}

function MembersList({
  members,
  initialRemoveId,
  initialMenuId,
  onRemove,
}: {
  members: WorkspaceMember[]
  initialRemoveId?: string
  initialMenuId?: string
  onRemove: (m: WorkspaceMember) => void
}) {
  const [removing, setRemoving] = useState<WorkspaceMember | null>(
    members.find((m) => m.id === initialRemoveId) ?? null
  )
  const others = members.filter((m) => m.status !== "owner")

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-medium">{c.members}</h3>
        <p className="text-xs text-muted-foreground tabular-nums">{c.count(members.length)}</p>
      </div>

      <div role="table" aria-label={c.members} className="space-y-3 md:space-y-0 md:divide-y md:rounded-lg md:border">
        <div role="row" className="hidden h-10 items-center gap-4 px-4 text-xs font-medium text-muted-foreground md:flex">
          <span role="columnheader" className="flex-1">{c.colName}</span>
          <span role="columnheader" className="w-28">{c.colAccess}</span>
          <span role="columnheader" className="w-24">{c.colLastActive}</span>
          <span role="columnheader" className="w-8">
            <span className="sr-only">{c.colActions}</span>
          </span>
        </div>
        {members.map((m) => (
          <div
            role="row"
            key={m.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-lg border p-4 md:flex-nowrap md:rounded-none md:border-0 md:py-3"
          >
            <div role="cell" className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar>
                {m.photo && <AvatarImage src={m.photo} alt="" />}
                <AvatarFallback>{m.status === "invited" ? m.email.charAt(0).toUpperCase() : getInitials(m.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{m.name}</p>
                {m.name !== m.email && (
                  <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                )}
              </div>
            </div>
            <div role="cell" className="order-last flex w-full items-center justify-between gap-4 text-sm md:order-none md:w-28 md:justify-start">
              <span className="text-xs text-muted-foreground md:hidden">{c.colAccess}</span>
              <AccessCell m={m} />
            </div>
            <div role="cell" className="order-last flex w-full items-center justify-between gap-4 text-sm text-muted-foreground md:order-none md:w-24 md:justify-start">
              <span className="text-xs md:hidden">{c.colLastActive}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} aria-label={`${c.colLastActive}: ${c.notTracked.toLowerCase()}`} className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                    —
                  </span>
                </TooltipTrigger>
                <TooltipContent>{c.notTracked}</TooltipContent>
              </Tooltip>
            </div>
            <div role="cell" className="flex size-8 shrink-0 items-center justify-center">
              {m.status !== "owner" && (
                <DropdownMenu defaultOpen={m.id === initialMenuId} modal={m.id !== initialMenuId}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label={c.actionsFor(m.name)}>
                      <MoreHorizontal aria-hidden />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem variant="destructive" onSelect={() => setRemoving(m)}>
                      {m.status === "invited" ? c.cancelInvite : c.removeMember}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ))}
      </div>

      {others.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Users className="size-6 text-muted-foreground" aria-hidden />
          </div>
          <p className="text-sm font-medium">{c.emptyTitle}</p>
          <p className="text-xs text-muted-foreground">{c.emptyBody}</p>
        </div>
      )}

      <Dialog open={removing !== null} onOpenChange={(o) => !o && setRemoving(null)}>
        <DialogContent>
          {removing && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {removing.status === "invited"
                    ? c.cancelInviteTitle(removing.email)
                    : c.removeTitle(removing.name)}
                </DialogTitle>
                <DialogDescription>
                  {removing.status === "invited" ? c.cancelInviteBody : c.removeBody(removing.name)}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" autoFocus>
                    {c.cancel}
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onRemove(removing)
                    setRemoving(null)
                  }}
                >
                  {removing.status === "invited" ? c.confirmCancelInvite : c.confirmRemove}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
