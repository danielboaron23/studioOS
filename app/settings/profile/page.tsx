import type { Metadata } from "next"
import { ProfileSection } from "@/components/settings/sections"

export const metadata: Metadata = { title: "Profile · Settings · Studio OS" }

export default function ProfileSettingsPage() {
  return <ProfileSection />
}
