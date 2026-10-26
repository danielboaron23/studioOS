import type { Metadata } from "next"
import { NotificationsSection } from "@/components/settings/sections"

export const metadata: Metadata = { title: "Notifications · Settings · Studio OS" }

export default function NotificationsSettingsPage() {
  return <NotificationsSection />
}
