import type { Metadata } from "next"
import { AppearanceSection } from "@/components/settings/sections"

export const metadata: Metadata = { title: "Appearance · Settings · Studio OS" }

export default function AppearanceSettingsPage() {
  return <AppearanceSection />
}
