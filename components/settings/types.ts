export type ProfileRole =
  | "Product designer"
  | "Brand designer"
  | "Motion designer"
  | "Designer (IC)"
  | "Founder"

export interface ProfileSettings {
  avatar: string | null
  name: string
  role: ProfileRole
  email: string
  bio: string
}

export type ThemeSetting = "system" | "light" | "dark"
export type Density = "comfortable" | "compact"

export interface AppearanceSettings {
  theme: ThemeSetting
  density: Density
  reducedMotion: boolean
}

export type NotificationChannel = "inApp" | "email"
export type NotificationCategory =
  | "comment"
  | "mention"
  | "status"
  | "digest"
  | "product"
export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"

export interface NotificationSettings {
  channels: Record<NotificationChannel, boolean>
  matrix: Record<NotificationCategory, Record<NotificationChannel, boolean>>
  quietHours: { enabled: boolean; start: string; end: string; days: Weekday[] }
}

export type MemberStatus = "owner" | "member" | "invited"

export interface WorkspaceMember {
  id: string
  name: string
  email: string
  photo?: string
  status: MemberStatus
}

export interface WorkspaceSettings {
  name: string
  slug: string
  logo: string | null
  members: WorkspaceMember[]
}

export interface Settings {
  profile: ProfileSettings
  appearance: AppearanceSettings
  notifications: NotificationSettings
  workspace: WorkspaceSettings
}

export type FieldErrors<K extends string = string> = Partial<Record<K, string>>
