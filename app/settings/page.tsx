import { redirect } from "next/navigation"

// Spec open question 2: if redirect() isn't supported by the static export,
// render <ProfileSection /> here instead.
export default function SettingsPage() {
  redirect("/settings/profile")
}
