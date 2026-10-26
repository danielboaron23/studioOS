"use client"

import { AppearanceForm } from "@/components/settings/appearance-form"
import { copy } from "@/components/settings/copy"
import { defaultSettings, seededMembers } from "@/components/settings/defaults"
import { NotificationsForm } from "@/components/settings/notifications-form"
import { ProfileForm } from "@/components/settings/profile-form"
import { SaveBar } from "@/components/settings/save-bar"
import { SettingsNav } from "@/components/settings/settings-nav"
import { SettingsSkeleton } from "@/components/settings/settings-skeleton"
import { WorkspaceForm } from "@/components/settings/workspace-form"

/**
 * Design review: every Settings v1 state side by side, each in a
 * [data-frame] for element screenshots. Interactive states (dialogs,
 * toasts, hover, focus) are captured on the live routes instead.
 * Not linked from the app; delete before shipping.
 */
const s = defaultSettings
const filledProfile = {
  ...s.profile,
  avatar: "https://i.pravatar.cc/300?img=5",
  bio: "Product designer at Studio OS. I run discovery and design for three client projects and look after our design system.",
}
const longBio = "I design things. ".repeat(18).trim()
const invited = {
  id: "inv-1",
  name: "lior@client.co",
  email: "lior@client.co",
  status: "invited" as const,
}

function Frame({ name, title, children }: { name: string; title: string; children: React.ReactNode }) {
  return (
    <section data-frame={name} className="flex flex-col gap-3 rounded-xl border bg-background p-6">
      <p className="font-mono text-xs text-muted-foreground">{name} · {title}</p>
      <div className="max-w-2xl">{children}</div>
    </section>
  )
}

export default function SettingsDesignReview() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings v1 · design review</h1>
        <p className="text-sm text-muted-foreground">Every state, side by side. Not part of the product.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Frame name="nav" title="Section nav · active by URL">
          <div className="flex flex-col gap-6">
            <SettingsNav activeHref="/settings/notifications" className="lg:w-60 lg:flex-col" />
          </div>
        </Frame>
        <Frame name="loading" title="Loading · Skeleton before hydration">
          <SettingsSkeleton rows={3} />
        </Frame>
        <Frame name="profile-empty" title="Profile · default (initials, empty bio)">
          <ProfileForm saved={s.profile} />
        </Frame>
        <Frame name="profile-filled" title="Profile · filled">
          <ProfileForm saved={filledProfile} />
        </Frame>
        <Frame name="profile-errors" title="Profile · validation + upload too large">
          <ProfileForm
            saved={s.profile}
            initialDraft={{ ...s.profile, name: "", bio: longBio }}
            initialErrors={{
              avatar: copy.errors.avatarSize,
              name: copy.errors.nameEmpty,
              bio: copy.errors.bioLength,
            }}
          />
        </Frame>
        <Frame name="profile-dirty" title="Profile · dirty with save bar">
          <ProfileForm saved={s.profile} initialDraft={{ ...s.profile, role: "Founder" }} />
        </Frame>
        <Frame name="profile-saving" title="Profile · saving (disabled)">
          <ProfileForm saved={s.profile} initialDraft={{ ...s.profile, role: "Founder" }} forceSaving />
        </Frame>
        <Frame name="save-bar" title="Save bar · idle and saving">
          <div className="flex flex-col gap-4">
            <SaveBar saving={false} onDiscard={() => {}} onSave={() => {}} />
            <SaveBar saving onDiscard={() => {}} onSave={() => {}} />
          </div>
        </Frame>
        <Frame name="appearance-default" title="Appearance · default">
          <AppearanceForm saved={s.appearance} apply={false} />
        </Frame>
        <Frame name="appearance-compact" title="Appearance · dark, compact, reduce motion">
          <AppearanceForm saved={{ theme: "dark", density: "compact", reducedMotion: true }} apply={false} />
        </Frame>
        <Frame name="notifications-default" title="Notifications · default (Email coming soon)">
          <NotificationsForm saved={s.notifications} />
        </Frame>
        <Frame name="notifications-off" title="Notifications · In-app off (empty)">
          <NotificationsForm saved={{ ...s.notifications, channels: { inApp: false, email: false } }} />
        </Frame>
        <Frame name="notifications-quiet" title="Notifications · quiet hours, overnight, dirty">
          <NotificationsForm
            saved={s.notifications}
            initialDraft={{ ...s.notifications, quietHours: { ...s.notifications.quietHours, enabled: true } }}
          />
        </Frame>
        <Frame name="notifications-errors" title="Notifications · quiet hours errors">
          <NotificationsForm
            saved={s.notifications}
            initialDraft={{
              ...s.notifications,
              quietHours: { enabled: true, start: "09:00", end: "09:00", days: [] },
            }}
            initialErrors={{ "quiet-start": copy.errors.quietSame, "day-Mon": copy.errors.quietNoDays }}
          />
        </Frame>
        <Frame name="workspace-default" title="Workspace · default">
          <WorkspaceForm saved={s.workspace} />
        </Frame>
        <Frame name="workspace-invite" title="Workspace · invite chips, invalid, already a member, Invited badge">
          <WorkspaceForm
            saved={{ ...s.workspace, members: [...seededMembers.slice(0, 3), invited] }}
            initialChips={[
              { email: "maya@client.co", valid: true },
              { email: "not-an-email", valid: false },
            ]}
            initialAlready={["tal@studio-os.dev"]}
          />
        </Frame>
        <Frame name="workspace-errors" title="Workspace · validation + logo wrong type">
          <WorkspaceForm
            saved={s.workspace}
            initialDraft={{ ...s.workspace, name: "S", slug: "Studio OS!" }}
            initialErrors={{
              "ws-name": copy.errors.nameShort,
              slug: copy.errors.slugChars,
              logo: copy.errors.logoType,
            }}
          />
        </Frame>
        <Frame name="workspace-logo-square" title="Workspace · logo not square">
          <WorkspaceForm saved={s.workspace} initialErrors={{ logo: copy.errors.logoSquare }} />
        </Frame>
        <Frame name="workspace-empty" title="Workspace · only you (empty members)">
          <WorkspaceForm saved={{ ...s.workspace, members: seededMembers.slice(0, 1) }} />
        </Frame>
      </div>
    </div>
  )
}
