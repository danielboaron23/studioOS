"use client"

import { useState } from "react"
import { toast } from "sonner"
import { copy } from "./copy"
import type { FieldErrors } from "./types"

export interface SectionFormProps<T, K extends string = string> {
  /** Last saved values. */
  saved: T
  onSave?: (value: T) => void
  /** Design-review hooks: start dirty, with errors, or mid-save. */
  initialDraft?: T
  initialErrors?: FieldErrors<K>
  forceSaving?: boolean
}

export function useSectionForm<T, K extends string>(
  { saved, onSave, initialDraft, initialErrors, forceSaving }: SectionFormProps<T, K>,
  validate: (value: T) => FieldErrors<K>
) {
  const [draft, setDraft] = useState<T>(initialDraft ?? saved)
  const [errors, setErrors] = useState<FieldErrors<K>>(initialErrors ?? {})
  const [saving, setSaving] = useState(false)
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)

  function update(patch: Partial<T>) {
    setDraft((d) => ({ ...d, ...patch }))
  }

  /** Validate one field on blur. */
  function check(field: K) {
    const next = validate(draft)[field]
    setErrors((e) => ({ ...e, [field]: next }))
  }

  function setError(field: K, message: string | undefined) {
    setErrors((e) => ({ ...e, [field]: message }))
  }

  function save() {
    const found = validate(draft)
    setErrors((e) => ({ ...e, ...found }))
    const first = Object.keys(found).find((k) => found[k as K])
    if (first) {
      document.getElementById(first)?.focus()
      return
    }
    setSaving(true)
    // Simulated latency so the saving state is visible in the prototype.
    window.setTimeout(() => {
      onSave?.(draft)
      setSaving(false)
      toast.success(copy.toast.saved)
    }, 600)
  }

  function discard() {
    setDraft(saved)
    setErrors({})
  }

  return {
    draft,
    update,
    errors,
    check,
    setError,
    dirty,
    saving: saving || Boolean(forceSaving),
    save,
    discard,
  }
}
