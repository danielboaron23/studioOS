"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"
import { Label } from "./label"

const FieldContext = React.createContext<{ id: string; error?: boolean }>({
  id: "",
  error: false,
})

function useFieldContext() {
  return React.useContext(FieldContext)
}

function Field({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const id = React.useId()
  const error = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === FieldError
  )

  return (
    <FieldContext.Provider value={{ id, error }}>
      <div data-slot="field" className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </FieldContext.Provider>
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { id } = useFieldContext()
  return (
    <Label
      data-slot="field-label"
      htmlFor={id}
      className={className}
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { id } = useFieldContext()
  return (
    <p
      data-slot="field-description"
      id={`${id}-description`}
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { id } = useFieldContext()

  if (!children) {
    return null
  }

  return (
    <p
      data-slot="field-error"
      id={`${id}-error`}
      className={cn("text-xs font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  )
}

function FieldControl({
  className,
  asChild = false,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { asChild?: boolean }) {
  const { id, error } = useFieldContext()
  const Comp = asChild ? Slot.Root : "div"

  const childProps = asChild
    ? {
        id,
        "aria-describedby": `${id}-description`,
        "aria-invalid": error || undefined,
        "aria-errormessage": error ? `${id}-error` : undefined,
      }
    : {}

  return (
    <Comp data-slot="field-control" className={className} {...props} {...childProps}>
      {asChild
        ? React.Children.map(props.children as React.ReactElement, (child) =>
            React.cloneElement(child, childProps)
          )
        : props.children}
    </Comp>
  )
}

function FieldSet({
  className,
  ...props
}: React.FieldsetHTMLAttributes<HTMLFieldSetElement>) {
  const { error } = useFieldContext()

  return (
    <fieldset
      data-slot="field-set"
      aria-invalid={error || undefined}
      className={cn("space-y-2 border-none p-0", className)}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  ...props
}: React.HTMLAttributes<HTMLLegendElement>) {
  return (
    <legend
      data-slot="field-legend"
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
}

function FieldGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="field-group"
      className={cn("space-y-2", className)}
      {...props}
    />
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldControl,
  FieldSet,
  FieldLegend,
  FieldGroup,
}
