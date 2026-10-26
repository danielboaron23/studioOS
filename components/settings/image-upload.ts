import { copy } from "./copy"

export interface UploadRules {
  types: string[]
  maxBytes: number
  square?: boolean
  typeError: string
  sizeError: string
}

export const avatarRules: UploadRules = {
  types: ["image/png", "image/jpeg", "image/webp"],
  maxBytes: 2 * 1024 * 1024,
  typeError: copy.errors.avatarType,
  sizeError: copy.errors.avatarSize,
}

export const logoRules: UploadRules = {
  types: ["image/png", "image/svg+xml"],
  maxBytes: 1024 * 1024,
  square: true,
  typeError: copy.errors.logoType,
  sizeError: copy.errors.logoSize,
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Checks the file, then crops to a centred square and resizes to 256×256. */
export async function readImage(
  file: File,
  rules: UploadRules
): Promise<{ ok: true; dataUrl: string } | { ok: false; error: string }> {
  if (!rules.types.includes(file.type)) return { ok: false, error: rules.typeError }
  if (file.size > rules.maxBytes) return { ok: false, error: rules.sizeError }

  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url).catch(() => null)
    if (!img) return { ok: false, error: copy.errors.imageRead }
    if (rules.square && img.naturalWidth !== img.naturalHeight) {
      return { ok: false, error: copy.errors.logoSquare }
    }
    if (file.type === "image/svg+xml") {
      const text = await file.text()
      return { ok: true, dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(text)}` }
    }
    const side = Math.min(img.naturalWidth, img.naturalHeight)
    const canvas = document.createElement("canvas")
    canvas.width = 256
    canvas.height = 256
    canvas
      .getContext("2d")
      ?.drawImage(
        img,
        (img.naturalWidth - side) / 2,
        (img.naturalHeight - side) / 2,
        side,
        side,
        0,
        0,
        256,
        256
      )
    return { ok: true, dataUrl: canvas.toDataURL("image/png") }
  } finally {
    URL.revokeObjectURL(url)
  }
}
