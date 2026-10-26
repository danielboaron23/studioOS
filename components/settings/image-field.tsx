"use client"

import { useRef, useState } from "react"
import { Loader2, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { readImage, type UploadRules } from "./image-upload"

/**
 * Upload control shared by Profile avatar (round) and Workspace logo (square).
 * Files are center-cropped to 256×256 automatically; there is no crop screen.
 */
export function ImageField({
  id,
  label,
  helper,
  uploadLabel,
  removeLabel,
  removeAria,
  processingLabel,
  emptyAria,
  imageAlt = "",
  value,
  fallback,
  shape,
  rules,
  error,
  onChange,
  onError,
}: {
  id: string
  label: string
  helper: string
  uploadLabel: string
  removeLabel: string
  removeAria: string
  processingLabel: string
  emptyAria?: string
  imageAlt?: string
  value: string | null
  fallback: string
  shape: "round" | "square"
  rules: UploadRules
  error?: string
  onChange: (value: string | null) => void
  onError: (error: string | undefined) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const descId = `${id}-desc`
  const [processing, setProcessing] = useState(false)

  return (
    <div data-slot="image-field" className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-4">
        {shape === "round" ? (
          <Avatar size="lg">
            {value && <AvatarImage src={value} alt={imageAlt} className="object-cover" />}
            <AvatarFallback className="font-medium">{fallback}</AvatarFallback>
          </Avatar>
        ) : (
          <div
            aria-label={value ? undefined : emptyAria}
            className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted text-sm font-medium text-muted-foreground"
          >
            {value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="size-full object-cover" />
            ) : (
              fallback
            )}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-describedby={descId}
            disabled={processing}
            onClick={() => input.current?.click()}
          >
            {processing ? <Loader2 className="animate-spin" aria-hidden /> : <Upload aria-hidden />}
            {processing ? processingLabel : uploadLabel}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={removeAria}
              onClick={() => {
                onChange(null)
                onError(undefined)
              }}
            >
              {removeLabel}
            </Button>
          )}
        </div>
        <input
          ref={input}
          id={id}
          type="file"
          accept={rules.types.join(",")}
          className="sr-only"
          tabIndex={-1}
          aria-invalid={error ? true : undefined}
          aria-describedby={descId}
          onChange={async (e) => {
            const file = e.target.files?.[0]
            e.target.value = ""
            if (!file) return
            setProcessing(true)
            const result = await readImage(file, rules)
            setProcessing(false)
            if (result.ok) {
              onError(undefined)
              onChange(result.dataUrl)
            } else onError(result.error)
          }}
        />
      </div>
      <p id={descId} className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
        {error ?? helper}
      </p>
    </div>
  )
}
