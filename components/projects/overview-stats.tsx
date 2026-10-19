import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ProjectStat {
  title: string
  value: string
  caption: string
}

const stats: ProjectStat[] = [
  { title: "Active Projects", value: "12", caption: "+3 this month" },
  { title: "In Review", value: "4", caption: "Awaiting client feedback" },
  { title: "Completed", value: "28", caption: "+8 from last month" },
  { title: "Avg. Turnaround", value: "6.2d", caption: "−1.3 days this quarter" },
]

export function OverviewStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card
          key={s.title}
          className="border-red-200 bg-red-100 text-red-700 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-400"
        >
          <CardHeader>
            <CardTitle className="text-base font-medium leading-6">
              {s.title}
            </CardTitle>
            <p className="text-2xl font-bold leading-8 tracking-tight">
              {s.value}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{s.caption}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
