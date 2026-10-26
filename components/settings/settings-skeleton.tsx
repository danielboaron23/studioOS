import { copy } from "./copy"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

/** Loading state for any section: header, then label + control rows. */
export function SettingsSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-6" aria-busy="true" aria-label={copy.nav.loading}>
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Separator />
      <div className="flex items-center gap-4">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-8 w-32" />
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full max-w-sm" />
        </div>
      ))}
    </div>
  )
}
