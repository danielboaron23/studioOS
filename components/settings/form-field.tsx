import * as React from "react"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"

/**
 * Settings composition over the stock shadcn Field primitives (no primitive
 * edits). Spec: helper/error are text-xs and share id `${id}-desc`; the
 * single child control receives id, aria-describedby, aria-invalid and
 * aria-required. Validation runs on blur and on Save (owned by the form).
 */
export function FormField({
  id,
  label,
  helper,
  error,
  required,
  aside,
  className,
  children,
}: {
  id: string
  label: string
  helper?: React.ReactNode
  error?: string
  required?: boolean
  /** Right-aligned meta under the control, e.g. a character counter. */
  aside?: React.ReactNode
  className?: string
  children: React.ReactElement<Record<string, unknown>>
}) {
  const descId = `${id}-desc`
  const hasDesc = Boolean(error || helper)
  const control = React.cloneElement(children, {
    id,
    "aria-describedby": hasDesc ? descId : undefined,
    "aria-invalid": error ? true : undefined,
    "aria-required": required || undefined,
  })

  return (
    <Field data-invalid={error ? true : undefined} className={className}>
      <FieldLabel htmlFor={id}>
        {label}
        {required && (
          <span aria-hidden className="text-muted-foreground">
            *
          </span>
        )}
      </FieldLabel>
      {control}
      {(hasDesc || aside) && (
        <div className="flex items-start justify-between gap-4">
          {error ? (
            <FieldError id={descId} className="text-xs">
              {error}
            </FieldError>
          ) : helper ? (
            <FieldDescription id={descId} className="text-xs">
              {helper}
            </FieldDescription>
          ) : (
            <span />
          )}
          {aside}
        </div>
      )}
    </Field>
  )
}
