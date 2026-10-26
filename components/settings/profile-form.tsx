"use client"

import { BadgeCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { copy } from "./copy"
import { getInitials, roles } from "./defaults"
import { FormField } from "./form-field"
import { ImageField } from "./image-field"
import { avatarRules } from "./image-upload"
import { SaveBar } from "./save-bar"
import { SectionHeader } from "./section-header"
import type { FieldErrors, ProfileRole, ProfileSettings } from "./types"
import { useSectionForm, type SectionFormProps } from "./use-section-form"
import { useUnsavedGuard } from "./use-unsaved-guard"

export type ProfileField = "avatar" | "name" | "bio"
const BIO_MAX = 280

function validate(p: ProfileSettings): FieldErrors<ProfileField> {
  const name = p.name.trim()
  return {
    name: !name
      ? copy.errors.nameEmpty
      : name.length < 2
        ? copy.errors.nameShort
        : name.length > 60
          ? copy.errors.nameLong
          : undefined,
    bio: p.bio.length > BIO_MAX ? copy.errors.bioLength : undefined,
  }
}

export function ProfileForm(props: SectionFormProps<ProfileSettings, ProfileField>) {
  const f = useSectionForm(props, validate)
  const { dialog } = useUnsavedGuard("profile", f.dirty, f.discard)
  const d = f.draft
  const over = d.bio.length > BIO_MAX

  return (
    <div className="space-y-6">
      <SectionHeader title={copy.profile.title} description={copy.profile.description} />

      <ImageField
        id="avatar"
        label={copy.profile.avatar}
        helper={copy.profile.avatarHelper}
        uploadLabel={copy.profile.uploadAvatar}
        removeLabel={copy.profile.remove}
        removeAria={copy.profile.removeAria}
        processingLabel={copy.profile.processing}
        value={d.avatar}
        fallback={getInitials(d.name)}
        imageAlt={d.name}
        shape="round"
        rules={avatarRules}
        error={f.errors.avatar}
        onChange={(avatar) => f.update({ avatar })}
        onError={(e) => f.setError("avatar", e)}
      />

      <FormField
        id="name"
        label={copy.profile.name}
        helper={copy.profile.nameHelper}
        error={f.errors.name}
        required
      >
        <Input
          className="max-w-sm"
          value={d.name}
          placeholder={copy.profile.namePlaceholder}
          onChange={(e) => f.update({ name: e.target.value })}
          onBlur={() => f.check("name")}
        />
      </FormField>

      <FormField id="role" label={copy.profile.role}>
        <Select value={d.role} onValueChange={(role) => f.update({ role: role as ProfileRole })}>
          <SelectTrigger className="w-full max-w-sm">
            <SelectValue placeholder={copy.profile.rolePlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {roles.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{copy.profile.email}</Label>
        <div className="flex max-w-sm items-center gap-2">
          <Input
            id="email"
            readOnly
            value={d.email}
            aria-describedby="email-desc"
            className="text-muted-foreground"
          />
          <Badge variant="secondary">
            <BadgeCheck aria-hidden />
            {copy.profile.verified}
          </Badge>
        </div>
        <p id="email-desc" className="text-xs text-muted-foreground">
          {copy.profile.emailHelper}
        </p>
      </div>

      <FormField
        id="bio"
        label={copy.profile.bio}
        error={f.errors.bio}
        aside={
          <span
            className={cn(
              "shrink-0 text-xs tabular-nums",
              over ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {d.bio.length}/{BIO_MAX}
            <span className="sr-only" aria-live="polite">
              {BIO_MAX - d.bio.length <= 20 &&
                (over
                  ? `${d.bio.length - BIO_MAX} characters over the limit`
                  : `${BIO_MAX - d.bio.length} characters left`)}
            </span>
          </span>
        }
      >
        <Textarea
          className="min-h-24"
          value={d.bio}
          placeholder={copy.profile.bioPlaceholder}
          onChange={(e) => f.update({ bio: e.target.value })}
          onBlur={() => f.check("bio")}
        />
      </FormField>

      {f.dirty && <SaveBar saving={f.saving} onDiscard={f.discard} onSave={f.save} />}
      {dialog}
    </div>
  )
}
