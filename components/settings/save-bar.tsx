import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { copy } from "./copy"

/** Sticky at the bottom of the scroll area; only rendered while the form is dirty. */
export function SaveBar({
  saving,
  onDiscard,
  onSave,
  className,
}: {
  saving?: boolean
  onDiscard?: () => void
  onSave?: () => void
  className?: string
}) {
  return (
    <div
      data-slot="save-bar"
      role="region"
      aria-label={copy.saveBar.message}
      className={cn(
        "sticky bottom-0 z-10 flex items-center justify-between gap-4 border-t bg-background py-4",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        <span className="sm:hidden">{copy.saveBar.messageShort}</span>
        <span className="hidden sm:inline">{copy.saveBar.message}</span>
      </p>
      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDiscard} disabled={saving}>
          {copy.saveBar.discard}
        </Button>
        <Button type="button" onClick={onSave} disabled={saving}>
          {saving && <Loader2 className="animate-spin" aria-hidden />}
          {saving ? copy.saveBar.saving : copy.saveBar.save}
        </Button>
      </div>
    </div>
  )
}
