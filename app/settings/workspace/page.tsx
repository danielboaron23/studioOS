import type { Metadata } from "next"
import { WorkspaceSection } from "@/components/settings/sections"

export const metadata: Metadata = { title: "Workspace · Settings · Studio OS" }

export default function WorkspaceSettingsPage() {
  return <WorkspaceSection />
}
