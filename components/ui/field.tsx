"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"

const FieldContext = React.createContext<{
  id: string
  descriptionId: string
  errorId: string
  invalid: boolean
}>({
  id: "",
  descriptionId: "",
  errorId: "",
  invalid: false,
})

function useFieldContext() {
  const context = React.useContext(FieldContext)
  if (!context) {
    throw new Error("Field components must be used within a Field component")
  }
  return context
}

function Field({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const id = React.useId()
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`
  
  const hasError = React.Children.toArray(children).some(
    (child) => {
      if (!React.isValidElement(child)) return false
      if (child.type !== FieldError) return false
      const props = child.props as { children?: React.ReactNode }
      return !!props.children
    }
  )

  return (
    <FieldContext.Provider value={{ id, descriptionId, errorId, invalid: hasError }}>
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
  const { descriptionId } = useFieldContext()
  return (
    <p
      data-slot="field-description"
      id={descriptionId}
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
  const { errorId } = useFieldContext()

  if (!children) {
    return null
  }

  return (
    <p
      data-slot="field-error"
      id={errorId}
      className={cn("text-xs font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  )
}

function FieldSet({
  className,
  ...props
}: React.FieldsetHTMLAttributes<HTMLFieldSetElement>) {
  return (
    <fieldset
      data-slot="field-set"
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
  FieldSet,
  FieldLegend,
  FieldGroup,
}
