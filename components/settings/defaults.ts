import { team } from "@/components/team/data"
import type {
  NotificationCategory,
  ProfileRole,
  Settings,
  Weekday,
  WorkspaceMember,
} from "./types"

export const roles: ProfileRole[] = [
  "Product designer",
  "Brand designer",
  "Motion designer",
  "Designer (IC)",
  "Founder",
]

export const categories: { id: NotificationCategory; label: string; helper: string }[] = [
  { id: "comment", label: "New comment", helper: "When someone comments on your work" },
  { id: "mention", label: "Mention", helper: "When someone mentions you" },
  { id: "status", label: "Project status change", helper: "When a project moves to a new stage" },
  { id: "digest", label: "Weekly digest", helper: "A weekly summary of your projects" },
  { id: "product", label: "Product updates", helper: "New features in Studio OS" },
]

export const weekdays: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

/** 00:00 → 23:30 in 30-minute steps. */
export const halfHours = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, "0")
  return `${h}:${i % 2 ? "30" : "00"}`
})

const toEmail = (name: string) =>
  `${name.split(" ")[0].toLowerCase()}@studio-os.dev`

/** Seeded from components/team/data.ts; the first person is the current user (Owner). */
export const seededMembers: WorkspaceMember[] = team.map((m, i) => ({
  id: `m${i}`,
  name: m.name,
  email: toEmail(m.name),
  photo: m.photo,
  status: i === 0 ? "owner" : "member",
}))

export const defaultSettings: Settings = {
  profile: {
    avatar: null,
    name: "Hani Buskila",
    role: "Product designer",
    email: "hani@studio-os.dev",
    bio: "",
  },
  appearance: { theme: "system", density: "comfortable", reducedMotion: false },
  notifications: {
    channels: { inApp: true, email: false },
    matrix: {
      comment: { inApp: true, email: false },
      mention: { inApp: true, email: true },
      status: { inApp: true, email: false },
      digest: { inApp: true, email: true },
      product: { inApp: true, email: false },
    },
    quietHours: { enabled: false, start: "19:00", end: "08:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
  },
  workspace: {
    name: "Studio OS",
    slug: "studio-os",
    logo: null,
    members: seededMembers,
  },
}

export function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?"
  )
}
