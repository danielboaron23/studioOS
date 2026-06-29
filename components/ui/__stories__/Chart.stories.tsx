import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const data = [
  { month: 'Jan', thisYear: 8200, lastYear: 6100 },
  { month: 'Feb', thisYear: 9400, lastYear: 7300 },
  { month: 'Mar', thisYear: 7800, lastYear: 6800 },
  { month: 'Apr', thisYear: 10200, lastYear: 7500 },
  { month: 'May', thisYear: 11500, lastYear: 8200 },
  { month: 'Jun', thisYear: 9800, lastYear: 7900 },
]

const config = {
  thisYear: { label: 'This Year', color: 'var(--chart-1)' },
  lastYear: { label: 'Last Year', color: 'var(--chart-2)' },
} satisfies ChartConfig

const meta = {
  title: 'UI/Chart',
  component: ChartContainer,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ChartContainer>

export default meta
type Story = StoryObj<typeof meta>

export const Bars: Story = {
  render: () => (
    <ChartContainer config={config} className="h-64 w-[480px]">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="thisYear" fill="var(--color-thisYear)" radius={4} />
        <Bar dataKey="lastYear" fill="var(--color-lastYear)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
}

export const Lines: Story = {
  render: () => (
    <ChartContainer config={config} className="h-64 w-[480px]">
      <LineChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line dataKey="thisYear" stroke="var(--color-thisYear)" strokeWidth={2} dot={false} />
        <Line dataKey="lastYear" stroke="var(--color-lastYear)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  ),
}
