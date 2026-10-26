"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { copy } from "./copy"

export function UnsavedChangesDialog({
  section,
  open,
  onKeepEditing,
  onDiscard,
}: {
  /** Lowercase noun for the sentence, e.g. "your profile" -> "profile". */
  section: string
  open: boolean
  onKeepEditing: () => void
  onDiscard: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onKeepEditing()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.guard.title}</DialogTitle>
          <DialogDescription>{copy.guard.description(section)}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onKeepEditing}>
            {copy.guard.keep}
          </Button>
          <Button variant="destructive" onClick={onDiscard}>
            {copy.guard.discard}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
