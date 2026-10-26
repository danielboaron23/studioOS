import { SettingsNav } from "@/components/settings/settings-nav"
import { copy } from "@/components/settings/copy"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{copy.page.title}</h1>
        <p className="text-sm text-muted-foreground">{copy.page.description}</p>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
        <SettingsNav />
        <div className="min-w-0 max-w-2xl flex-1">{children}</div>
      </div>
    </div>
  )
}
