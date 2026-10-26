import { Separator } from "@/components/ui/separator"

export function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Separator />
    </div>
  )
}
