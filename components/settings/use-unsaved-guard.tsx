"use client"

import { useEffect, useRef, useState } from "react"
import { UnsavedChangesDialog } from "./unsaved-changes-dialog"

/**
 * Catches clicks on internal links while `dirty`, asks for confirmation,
 * and navigates after Discard. Also arms the browser beforeunload prompt.
 */
export function useUnsavedGuard(section: string, dirty: boolean, onDiscard: () => void) {
  // Keep the clicked link and re-click it after Discard, so next/link handles
  // routing (and any basePath) exactly as it would have.
  const [pending, setPending] = useState<HTMLAnchorElement | null>(null)
  const bypass = useRef(false)

  useEffect(() => {
    if (!dirty) return
    function onClick(e: MouseEvent) {
      if (bypass.current) return
      const a = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null
      if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey) return
      const url = new URL(a.href)
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return
      e.preventDefault()
      e.stopPropagation()
      setPending(a)
    }
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
    }
    document.addEventListener("click", onClick, true)
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => {
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("beforeunload", onBeforeUnload)
    }
  }, [dirty])

  const dialog = (
    <UnsavedChangesDialog
      section={section}
      open={pending !== null}
      onKeepEditing={() => setPending(null)}
      onDiscard={() => {
        const link = pending
        setPending(null)
        onDiscard()
        bypass.current = true
        link?.click()
        bypass.current = false
      }}
    />
  )
  return { dialog }
}
