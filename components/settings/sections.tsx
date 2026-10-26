"use client"

import { AppearanceForm } from "./appearance-form"
import { NotificationsForm } from "./notifications-form"
import { ProfileForm } from "./profile-form"
import { saveSection, useSettings } from "./settings-store"
import { SettingsSkeleton } from "./settings-skeleton"
import { WorkspaceForm } from "./workspace-form"

/** Each section reads the store and shows a Skeleton until hydrated (spec state). */
export function ProfileSection() {
  const s = useSettings()
  if (!s) return <SettingsSkeleton rows={4} />
  return <ProfileForm saved={s.profile} onSave={(v) => saveSection("profile", v)} />
}

export function AppearanceSection() {
  const s = useSettings()
  if (!s) return <SettingsSkeleton rows={3} />
  return <AppearanceForm saved={s.appearance} onSave={(v) => saveSection("appearance", v)} />
}

export function NotificationsSection() {
  const s = useSettings()
  if (!s) return <SettingsSkeleton rows={4} />
  return (
    <NotificationsForm saved={s.notifications} onSave={(v) => saveSection("notifications", v)} />
  )
}

export function WorkspaceSection() {
  const s = useSettings()
  if (!s) return <SettingsSkeleton rows={4} />
  return <WorkspaceForm saved={s.workspace} onSave={(v) => saveSection("workspace", v)} />
}
