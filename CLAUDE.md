# Studio OS — Design System & Figma MCP Integration Rules

This document is the authoritative rules doc for working with the Studio OS codebase and integrating Figma designs via the Model Context Protocol. Read this before generating, editing, or translating any UI.

---

## 0. TL;DR for Figma → Code work

Stack: **Next.js 16 App Router + React 19 + TypeScript (strict) + Tailwind CSS v4 + shadcn/ui (new-york) + Radix Primitives + lucide-react**.

Non-negotiables when implementing a Figma design:

1. **Never invent tokens.** Use the CSS variables in `app/globals.css` (`bg-primary`, `text-muted-foreground`, `border`, `bg-card`, `bg-sidebar`, etc.). No raw hex.
2. **Reuse `components/ui/*` primitives** before composing anything new. Extend variants in the existing CVA configs rather than adding parallel components.
3. **Compose with `cn()`** from `@/lib/utils` — never concatenate className strings manually.
4. **Icons = lucide-react only.** Never inline SVGs from Figma when a lucide equivalent exists.
5. **Default `size-4`** for inline icons (this is baked into `Button` and most primitives).
6. **No new color, radius, or spacing scale.** Tailwind defaults + the OKLCH tokens in `globals.css` are the entire palette.
7. **Path alias:** `@/*` → repo root. Always use `@/components/ui/...`, `@/lib/utils`, `@/hooks/...`.

---

## 1. Token Definitions

### Location

All design tokens live in a single file: **`app/globals.css`**.

There is no Style Dictionary, no `tokens.json`, no Figma Tokens plugin export, and no JS/TS token module. Tokens are declared once as CSS custom properties and consumed via Tailwind v4's `@theme inline` directive.

### Format

Three layers:

1. **CSS variables** on `:root` (light) and `.dark` (dark mode).
2. **`@theme inline { ... }`** block in `globals.css` that re-exposes those variables as Tailwind utilities (`bg-primary`, `text-muted-foreground`, etc.).
3. **No transformation pipeline.** Edit the CSS file → utilities update on next build.

### Color tokens

Colors use the **OKLCH** color space (not hex, not HSL).

```css
/* app/globals.css */
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  --primary-foreground: oklch(0.984 0.003 247.858);
  --secondary: oklch(0.968 0.007 247.896);
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.896);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.704 0.04 256.788);
  --chart-1: oklch(0.646 0.222 41.116);  /* … chart-2..5 */
  --sidebar: oklch(0.984 0.003 247.858);
  --sidebar-primary: oklch(0.208 0.042 265.755);
  /* … sidebar-foreground, sidebar-accent, sidebar-border, sidebar-ring */
}

.dark { /* same variables, dark values */ }
```

**Base palette:** `slate` (declared in `components.json`). Style: `new-york`.

### Semantic token surface (the only colors you should reference)

| Token group | Variables | Tailwind utilities |
|---|---|---|
| Surface | `--background`, `--foreground` | `bg-background`, `text-foreground` |
| Card | `--card`, `--card-foreground` | `bg-card`, `text-card-foreground` |
| Popover | `--popover`, `--popover-foreground` | `bg-popover`, `text-popover-foreground` |
| Primary action | `--primary`, `--primary-foreground` | `bg-primary`, `text-primary-foreground` |
| Secondary | `--secondary`, `--secondary-foreground` | `bg-secondary`, `text-secondary-foreground` |
| Muted | `--muted`, `--muted-foreground` | `bg-muted`, `text-muted-foreground` |
| Accent | `--accent`, `--accent-foreground` | `bg-accent`, `text-accent-foreground` |
| Destructive | `--destructive` | `bg-destructive`, `text-destructive` |
| Form | `--border`, `--input`, `--ring` | `border`, `border-input`, `ring-ring` |
| Charts | `--chart-1`…`--chart-5` | `fill-chart-1`, `stroke-chart-2`, etc. |
| Sidebar | `--sidebar*` (7 vars) | `bg-sidebar`, `text-sidebar-foreground`, … |

**Status colors (NOT in the token system, used directly from Tailwind palette):**
The codebase uses Tailwind's `emerald-*`, `amber-*`, `red-*` for health/status badges. See `components/projects/health-badge.tsx`:

```tsx
const styles: Record<ProjectHealth, string> = {
  Healthy:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "At Risk": "bg-amber-100   text-amber-700   dark:bg-amber-900/30   dark:text-amber-400",
  Critical:  "bg-red-100     text-red-700     dark:bg-red-900/30     dark:text-red-400",
}
```

When mapping Figma status pills, use this exact triad. Do not introduce `green-*`/`yellow-*`.

### Radius tokens

`--radius: 0.625rem` (10px) is the base; Tailwind v4 derives a full scale:

```css
@theme inline {
  --radius-sm:  calc(var(--radius) - 4px);  /* 6px  */
  --radius-md:  calc(var(--radius) - 2px);  /* 8px  */
  --radius-lg:  var(--radius);              /* 10px */
  --radius-xl:  calc(var(--radius) + 4px);  /* 14px */
  --radius-2xl: calc(var(--radius) + 8px);  /* 18px */
  --radius-3xl: calc(var(--radius) + 12px); /* 22px */
  --radius-4xl: calc(var(--radius) + 16px); /* 26px */
}
```

Use `rounded-md` for buttons/inputs, `rounded-lg` for tab lists/pills, `rounded-xl` for cards, `rounded-full` for avatars and dots.

### Typography tokens

Fonts loaded via `next/font/google` in `app/layout.tsx`:

```tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
```

Exposed as Tailwind utilities: `font-sans` (Geist), `font-mono` (Geist Mono).

**No custom type scale defined.** Use Tailwind defaults: `text-xs` / `text-sm` / `text-base` / `text-lg` / `text-xl` / `text-2xl`. Observed usage:
- Page titles: `text-2xl font-bold`
- Card titles: `text-sm font-medium` or `leading-none font-semibold`
- Body: `text-sm`
- Captions / meta: `text-xs text-muted-foreground`

### Spacing tokens

No custom spacing scale. Tailwind defaults only. Standard page padding: `p-4 md:p-6` with `max-w-screen-xl mx-auto` (see `app/layout.tsx`).

### Token transformation

**None.** What you see in `globals.css` is what ships. If you need to add a token, edit that file, add the variable, then add the matching alias in the `@theme inline` block.

---

## 2. Component Library

### Architecture

Two tiers, lined up by directory:

| Tier | Location | Purpose | Examples |
|---|---|---|---|
| **Primitives** | `components/ui/` | shadcn/ui components wrapping Radix. Stateless, generic, design-system-only. 22 components total. | `Button`, `Card`, `Input`, `Tabs`, `Avatar`, `Sheet`, `Sidebar`, `Tooltip`, `Skeleton`, `Select`, `Separator`, `Chart`, `Dialog`, `DropdownMenu`, and form primitives (`Switch`, `Checkbox`, `RadioGroup`, `Label`, `Field`, `Textarea`, `Toaster`) |
| **Feature components** | `components/`, `components/<feature>/` | Composed product UI. May contain business logic and data. | `Header`, `AppSidebar`, `components/projects/*` (HealthBadge, ProjectPulseCard, PulseSection, AllProjectsTable) |

### Primitives — conventions

Every primitive in `components/ui/` follows the shadcn "new-york" template:

```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ...",
  {
    variants: {
      variant: { default: "...", destructive: "...", outline: "...", secondary: "...", ghost: "...", link: "..." },
      size:    { default: "h-9 px-4 py-2", xs: "h-6 ...", sm: "h-8 ...", lg: "h-10 ...", icon: "size-9", "icon-xs": "size-6 ...", "icon-sm": "size-8", "icon-lg": "size-10" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

**Rules every primitive follows:**
- `data-slot="<kebab-name>"` on the root element (used as the Figma Code Connect anchor and for compound-component targeting via `[data-slot=...]`).
- Variants modeled with **`class-variance-authority`** (`cva`), exported as `<name>Variants` for composition.
- All className composition via **`cn()`** from `@/lib/utils`.
- Defaults declared in `defaultVariants` — never duplicate them in JSX.
- `asChild` prop for polymorphism (via `radix-ui`'s `Slot.Root`).
- Sub-parts (`CardHeader`, `CardTitle`, `TabsList`, …) live in the same file and are named exports.

### Compound component pattern

Multi-part primitives export their sub-parts from one file:

```tsx
// components/ui/card.tsx
export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }

// components/ui/tabs.tsx
export { Tabs, TabsList, TabsTrigger, TabsContent }

// components/ui/avatar.tsx
export { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount }
```

When Figma shows a card with header/body/footer, map 1:1 to these sub-parts. Do not collapse them into a single `<div>`.

### Size variants via data attributes (Avatar pattern)

```tsx
// components/ui/avatar.tsx
<AvatarPrimitive.Root
  data-slot="avatar"
  data-size={size}  // "default" | "sm" | "lg"
  className={cn(
    "group/avatar relative flex size-8 ... data-[size=lg]:size-10 data-[size=sm]:size-6",
    className
  )}
/>
```

Avatar uses `data-size` + the Tailwind `data-[size=...]:` variant + `group/avatar` so children (badge, fallback) can react to parent size. Follow this pattern instead of prop-drilling size.

### Existing primitive inventory (`components/ui/`)

**22 components total, 20 with stories:**

| File | Components |
|---|---|
| `button.tsx` | `Button`, `buttonVariants` |
| `card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` |
| `input.tsx` | `Input` |
| `select.tsx` | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, … |
| `tabs.tsx` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` |
| `avatar.tsx` | `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarGroup`, `AvatarGroupCount` |
| `separator.tsx` | `Separator` |
| `sheet.tsx` | `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, … |
| `sidebar.tsx` | `Sidebar`, `SidebarProvider`, `SidebarInset`, `SidebarHeader`, `SidebarContent`, `SidebarGroup`, `SidebarMenu`, `SidebarMenuButton`, `SidebarTrigger`, … |
| `skeleton.tsx` | `Skeleton` |
| `tooltip.tsx` | `Tooltip`, `TooltipTrigger`, `TooltipContent` |
| `chart.tsx` | `ChartContainer`, `ChartTooltip`, `ChartLegend` (recharts wrappers) |
| `badge.tsx` | `Badge` |
| `switch.tsx` | `Switch` |
| `textarea.tsx` | `Textarea` |
| `sonner.tsx` | `Toaster` (toast notifications) |
| `radio-group.tsx` | `RadioGroup`, `RadioGroupItem` |
| `checkbox.tsx` | `Checkbox` |
| `label.tsx` | `Label` |
| `field.tsx` | `Field`, `FieldContent`, `FieldLabel`, `FieldTitle`, `FieldDescription`, `FieldError`, `FieldSeparator`, `FieldSet`, `FieldLegend`, `FieldGroup` |
| `dialog.tsx` | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, … (no story yet) |
| `dropdown-menu.tsx` | `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, … (no story yet) |

### Deviations from stock shadcn

Most primitives are verbatim from the shadcn new-york-v4 registry with only import path adaptations. The following intentional deviations exist:

1. **`checkbox.tsx`** — Adds indeterminate state support:
   - Includes `Minus` icon alongside `Check`
   - Uses `group/checkbox` and `group-data-[state=indeterminate]/checkbox:block` to toggle icons
   - Adds `dark:data-[state=checked]:bg-primary` and `dark:data-[state=indeterminate]:bg-primary` to fix dark mode regression where `dark:bg-input/30` would override the checked/indeterminate background
   - Allows `defaultChecked="indeterminate"` to work properly

2. **`switch.tsx`** — Adds RTL support and aria-invalid styling:
   - Adds `rtl:data-[state=checked]:-translate-x-[calc(100%-2px)]` and `rtl:data-[state=unchecked]:translate-x-0` to keep thumb within track bounds in RTL mode
   - Adds `aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40` for form validation feedback

3. **`sonner.tsx`** — Uses local MutationObserver instead of next-themes:
   - Implements `useTheme()` hook that watches `document.documentElement.classList` for `.dark` class changes
   - Avoids adding `next-themes` as a dependency since the app manages dark mode via a simple class toggle in `components/header.tsx`

If a Figma component matches an existing primitive — **use it.** Don't recreate `Button`/`Card`/`Input`.

### Feature components — conventions

Feature components live one level up from `ui/`. Two organizational patterns are in use:

1. **Flat** (top-level): `components/header.tsx`, `components/sidebar.tsx`.
2. **Feature folders** (preferred for richer features): `components/projects/`. Each folder may include `types.ts`, `data.ts`, and multiple view/section components.

**Pattern for a feature folder:**

```
components/projects/
├── all-projects-table.tsx ← main table view
├── project-pulse-card.tsx ← small card variant
├── pulse-section.tsx      ← grouping component
├── health-badge.tsx       ← inline status pill
├── data.ts                ← mock/sample data
└── types.ts               ← TypeScript types for this feature
```

When you scaffold a new multi-state feature from Figma, use this folder layout with siblings for each view + `types.ts` + (when needed) `data.ts`. Add `empty-state.tsx` / `error-state.tsx` / `loading-state.tsx` siblings if the feature has those states.

**Example feature component (composition over primitives):**

```tsx
// components/projects/health-badge.tsx
import { AlertOctagon, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { ProjectHealth } from "./types"

const styles: Record<ProjectHealth, string> = {
  Healthy:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "At Risk": "bg-amber-100   text-amber-700   dark:bg-amber-900/30   dark:text-amber-400",
  Critical:  "bg-red-100     text-red-700     dark:bg-red-900/30     dark:text-red-400",
}

const icons: Record<ProjectHealth, typeof CheckCircle2> = {
  Healthy: CheckCircle2,
  "At Risk": AlertTriangle,
  Critical: AlertOctagon,
}

export function HealthBadge({ health, reason }: { health: ProjectHealth; reason: string }) {
  const Icon = icons[health]
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", styles[health])}>
          <Icon className="size-3.5" aria-hidden />
          <span>{health}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">{reason}</TooltipContent>
    </Tooltip>
  )
}
```

Notes:
- Icons typed as `LucideIcon`.
- Animation uses the standard easing `cubic-bezier(0.22,1,0.36,1)` (use the same when adding hover lift).
- Standard hover pattern for cards: `hover:-translate-y-0.5 hover:shadow-md`.

### Documentation / Storybook

**Storybook is configured and running.** The codebase has a `.storybook/` directory with configuration and 23 `.stories.tsx` files (20 primitives, 3 feature components). Component stories demonstrate variants, states, and usage patterns. Run `npm run storybook` for the dev server or `npm run build-storybook` to build the static site.

Component contracts are documented through:
- TypeScript types and interfaces
- `data-slot`/`data-size`/`data-variant` attributes
- Storybook stories with interactive controls
- Play functions for interaction testing (Field stories only)

If you're asked to add a component, include a `.stories.tsx` file following the existing patterns in `components/ui/*.stories.tsx`.

---

## 3. Frameworks & Libraries

### Stack

| Concern | Library | Version |
|---|---|---|
| Framework | **Next.js** (App Router, static export) | `16.1.6` |
| UI | **React** | `19.2.3` |
| Language | **TypeScript** (strict) | `^5` |
| Styling | **Tailwind CSS** v4 + `tw-animate-css` | `^4` |
| Component system | **shadcn/ui** (new-york style) | `^3.8.5` (CLI) |
| Headless primitives | **radix-ui** (single-package import) | `^1.4.3` |
| Variants | **class-variance-authority** | `^0.7.1` |
| className merging | **clsx** + **tailwind-merge** | `^2.1.1` / `^3.4.1` |
| Icons | **lucide-react** | `^0.564.0` |
| Charts | **recharts** | `^2.15.4` |
| Drag & drop | **@dnd-kit/core**, **@dnd-kit/sortable**, **@dnd-kit/utilities** | latest |
| Linter | **eslint** + `eslint-config-next` | `^9` |

### Build / bundler

- **Next.js** with the **App Router** (`app/` directory).
- **Static export**: `next.config.ts` sets `output: "export"`, `basePath: "/studioOS"`, `images.unoptimized: true`. The site is rendered to `out/` and served from the `/studioOS` path (GitHub Pages).
- **PostCSS** with the `@tailwindcss/postcss` plugin (Tailwind v4 uses PostCSS, no `tailwind.config.js` needed — config is in `globals.css` via `@theme`).
- **Dev port:** `3001` (`npm run dev`).

### Import conventions

```tsx
// Path alias
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

// Radix is imported as a single package, namespaced
import { Tabs as TabsPrimitive } from "radix-ui"
import { Avatar as AvatarPrimitive } from "radix-ui"
import { Slot } from "radix-ui"
```

> Note the `radix-ui` single-package convention — **not** `@radix-ui/react-tabs`. Match this when adding new primitives.

---

## 4. Asset Management

### Location

All static assets live in **`public/`**:

```
public/
├── assets/        ← product assets (logos, illustrations)
│   └── Logo-D.png
├── logos/         ← partner / brand logos
├── studioOS/      ← export artifacts (static)
├── file.svg
├── globe.svg
├── next.svg
├── vercel.svg
└── window.svg
```

### Referencing

Use Next.js's `Image` component with a static import (preserves dimensions, hashes filename):

```tsx
// components/sidebar.tsx
import Image from "next/image"
import logoD from "@/public/assets/Logo-D.png"

<Image src={logoD} alt="Studio OS" className="size-full object-contain" />
```

For raw SVGs already in `public/`, reference by absolute path (`/file.svg`). Because of `basePath: "/studioOS"`, Next.js automatically prefixes these at build — **do not hardcode** `/studioOS/...` in source.

### Optimization

`next.config.ts` sets `images.unoptimized: true` (required for static export). Pre-optimize images (Squoosh, sharp) before committing — no runtime optimization happens.

**No CDN configured.** Assets ship from the same origin as the static export.

---

## 5. Icon System

### Library

**`lucide-react`** is the only icon library. No SVG sprite, no custom icon component.

### Usage

```tsx
import { Home, FolderOpen, ListTodo, Users, Settings, ChevronsUpDown } from "lucide-react"

<Home className="size-4" />
<ChevronsUpDown className="size-4 ml-auto" />
```

### Sizing rules

- **Default size inside Button/primitives:** `size-4` (16px). The `Button` variants auto-apply `[&_svg:not([class*='size-'])]:size-4`, so you can omit a size class if you want the default.
- **Sidebar icons:** `size-4` (default, applied via the menu primitive).
- **Header / action icons:** `size-5` (20px).
- **Inline / badge icons:** `size-3.5` (14px) — see `health-badge.tsx`.
- **Avatar dots / status:** `size-2` to `size-3`.

### When the icon needs a typed prop

Use the `LucideIcon` type:

```tsx
import type { LucideIcon } from "lucide-react"

interface MetricCardProps { icon: LucideIcon }
function MetricCard({ icon: Icon }: MetricCardProps) { return <Icon className="size-4" /> }
```

### Naming

Match the lucide pascal-case import name exactly. Do not alias unless avoiding a clash.

### When mapping from Figma

Replace any vector icon in the Figma file with its lucide equivalent. If no equivalent exists, **ask before adding a custom SVG** — most icons in Figma map cleanly to lucide.

---

## 6. Styling Approach

### Methodology

**Tailwind CSS v4, utility-first, no CSS Modules, no Styled Components, no emotion.** All component styling is inline className strings composed via `cn()`.

```tsx
import { cn } from "@/lib/utils"

<div className={cn("flex items-center gap-2", isActive && "bg-accent", className)} />
```

`cn()` is `twMerge(clsx(...))`:

```ts
// lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

This guarantees:
1. Conditional classes via `clsx` semantics (`["base", cond && "x", { y: cond }]`).
2. Conflicting Tailwind classes resolved by `tailwind-merge` (the *last* `bg-*` wins, etc.).

**Never concatenate className strings with `+` or template literals.** Always go through `cn()`.

### Global styles

Only **`app/globals.css`**. It contains:

1. Tailwind v4 imports: `@import "tailwindcss"; @import "tw-animate-css"; @import "shadcn/tailwind.css";`
2. The dark variant: `@custom-variant dark (&:is(.dark *));`
3. The `@theme inline { ... }` token aliases.
4. `:root` and `.dark` token blocks.
5. Two base layer rules:

```css
@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}
```

No other global stylesheets exist or should be added.

### Dark mode

- Activated by adding the **`.dark`** class to `<html>` (managed in `components/header.tsx` via `ThemeToggle`, persisted in `localStorage` under `"theme"`, with `prefers-color-scheme` fallback).
- Use Tailwind's `dark:` variant for any per-token override — but prefer the semantic tokens, which already swap automatically.
- `suppressHydrationWarning` on `<html>` and `<body>` is required (`app/layout.tsx`) because the theme is applied client-side.

### Responsive design

Tailwind's default breakpoints (`sm:` `md:` `lg:` `xl:` `2xl:`). Mobile-first.

Common observed patterns:
- Page padding: `p-4 md:p-6`
- Constrain reading width: `max-w-screen-xl mx-auto w-full`
- Hide on small screens: `hidden sm:flex` (see `Header` user name block)
- Mobile detection hook: `hooks/use-mobile.ts` (only when JS-level mobile branching is necessary; prefer CSS)

### Animation

- Library: **`tw-animate-css`** (provides `animate-*` utilities) imported globally.
- Custom transitions: explicit `transition-[...] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]`. Reuse this exact easing for hover lifts and card transforms.
- For Radix-driven animations (sheet, tooltip, select), the primitive already wires `data-[state=open]` / `data-[state=closed]` classes — extend them, don't recreate.

---

## 7. Project Structure

### Top-level

```
studio-os-next/
├── app/                    ← Next.js App Router pages + globals.css
│   ├── layout.tsx          ← Root layout: SidebarProvider, AppSidebar, Header, fonts
│   ├── page.tsx            ← / (Dashboard)
│   ├── globals.css         ← ⚠ All design tokens live here
│   ├── projects/           ← /projects (only page with content; uses components/projects/*)
│   ├── tasks/              ← /tasks (placeholder)
│   └── team/               ← /team (placeholder)
├── components/
│   ├── ui/                 ← shadcn/ui primitives (22 components)
│   ├── projects/           ← Projects feature folder
│   ├── header.tsx          ← Top bar (search, theme toggle, user)
│   └── sidebar.tsx         ← App sidebar (mainNav + secondaryNav + TeamSwitcher)
├── hooks/
│   └── use-mobile.ts
├── lib/
│   └── utils.ts            ← cn() — the only utility
├── public/                 ← Static assets (see §4)
├── docs/                   ← Project docs (not user-facing)
├── components.json         ← shadcn config (style: new-york, baseColor: slate)
├── next.config.ts          ← output: "export", basePath: "/studioOS"
├── postcss.config.mjs      ← @tailwindcss/postcss
├── tsconfig.json           ← strict + paths "@/*"
└── package.json
```

### Routing

Next.js App Router. Each route is a folder under `app/` with a `page.tsx`. Static export means no server actions, no route handlers, no dynamic SSR — everything resolves at build time.

### Feature organization pattern

When a feature grows beyond one component, give it a folder under `components/<feature>/` containing:

- One or more view components (`*-view.tsx`, `*-content.tsx`, `*-section.tsx`).
- State variants as siblings (`empty-state.tsx`, `error-state.tsx`, `loading-state.tsx`).
- `types.ts` for shared TypeScript types.
- `data.ts` for mock / sample data (replace with fetchers when wired to a backend).
- Small focused row/card components (`task-row.tsx`, `status-pill.tsx`, `next-up-card.tsx`).

Example (`components/projects/`):

```
all-projects-table.tsx ← main composed view (table)
pulse-section.tsx      ← grouping component
project-pulse-card.tsx ← compact card variant
health-badge.tsx       ← inline status pill
data.ts                ← mock data (PulseProject[])
types.ts               ← PulseProject, ProjectHealth, etc.
```

### Layout composition

The root `app/layout.tsx` is the canonical app frame:

```tsx
<SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    <Header />
    <div className="flex-1 p-4 md:p-6 max-w-screen-xl mx-auto w-full">
      {children}
    </div>
  </SidebarInset>
</SidebarProvider>
```

Every page lives inside this frame. **Do not** add a second sidebar/header in page-level components.

---

## 8. Figma MCP Integration Rules

When using the Figma MCP server (`get_design_context`, `get_screenshot`, `use_figma`, `generate_figma_design`, Code Connect tools), follow this workflow:

### Design → Code (importing a Figma frame)

1. **Pull context first.** Use `get_design_context` (and `get_screenshot` for visual reference) on the target node.
2. **Map components to existing primitives.** Before writing any new component, check `components/ui/` and existing feature folders. If a primitive matches, instantiate it.
3. **Map colors to tokens.** Translate every Figma color/style to the semantic tokens in §1. If a color doesn't map (e.g. status emerald/amber/red), use the Tailwind palette as defined in `health-badge.tsx` — never invent new `--*` variables.
4. **Replace icons with lucide.** Read the icon's name/intent from Figma, pick the closest `lucide-react` icon. Ask before adding any custom SVG.
5. **Compose with `cn()` + `cva`.** If the new component has more than one variant, model it as a `cva` config in the same file. Export `<name>Variants`.
6. **Use the folder convention.** Single component → flat file in `components/`. Multi-state feature → folder under `components/<feature>/` with empty/error/loading siblings.
7. **Wire data via `types.ts` + `data.ts`.** No fetchers yet — start with mock data, types in `types.ts`.

### Code → Design (pushing into Figma)

- **Load `/figma-use` before `use_figma`.** Mandatory per the figma MCP server instructions.
- **Load `/figma-generate-design` before `generate_figma_design`.** Mandatory for multi-section translations.
- **Load `/figma-generate-library` before building tokens or a component library in Figma.** Mandatory for design-system work in Figma.
- **Load `/figma-create-new-file` before `create_new_file`.** Mandatory.
- **Load `/figma-generate-diagram` before `generate_diagram`.** Mandatory.
- **Bind variables, never hardcode.** When the Figma library has variables, bind them; when it doesn't, create the variables first (using the `figma-generate-library` flow), then build.

### Code Connect

There are no Code Connect `.figma.ts` mappings checked in yet. If asked to set up Code Connect, target the primitives in `components/ui/` first (Button, Card, Input, Tabs, Avatar, Sidebar) — they're the stable design-system surface.

---

## 9. Conventions Quick Reference (do / don't)

| Do | Don't |
|---|---|
| `cn("flex", isOpen && "bg-accent")` | `\`flex \${isOpen ? "bg-accent" : ""}\`` |
| `<Button variant="secondary" size="sm">` | Re-implementing button styles inline |
| `bg-card text-card-foreground` | `bg-white text-slate-900` |
| `<Home className="size-4" />` | Inline `<svg>` from Figma |
| `import { Slot } from "radix-ui"` | `import * as SlotPrimitive from "@radix-ui/react-slot"` |
| `import logo from "@/public/assets/Logo-D.png"` | `src="/studioOS/assets/Logo-D.png"` |
| New token → edit `globals.css` `:root` + `.dark` + `@theme inline` | New token → add a JS constants file |
| Multi-state feature → `components/<feature>/` with empty/error/loading | One giant component with conditional rendering |
| `data-slot="card-header"` on a new primitive part | No data attribute (Code Connect won't anchor) |

---

## 10. Open gaps (be aware before promising)

- **Storybook configured with 23 stories (20 primitives + 3 feature).** Stories cover all major primitives. Two components (dialog, dropdown-menu) exist but have no stories yet.
- **No design-token export.** No `tokens.json`, Style Dictionary, or Figma Tokens sync.
- **No Code Connect mappings checked in.**
- **No formal type scale or spacing scale** beyond Tailwind defaults — typography choices are ad-hoc per component.
- **No theming beyond light/dark.** No multi-brand palettes.
- **Status colors live outside the token system** (raw `emerald-*`/`amber-*`/`red-*`). Be deliberate if introducing a fourth status.
- **Static export only.** No server components for data fetching; everything is `"use client"` or fully static.

If a task requires any of the above, surface it as a scope question before implementing.
