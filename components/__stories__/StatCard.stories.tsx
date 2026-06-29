import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DollarSign, FolderKanban, TrendingUp, Users } from 'lucide-react'

import { StatCard } from '@/components/stat-card'

const meta = {
  title: 'Dashboard/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    title: 'Total Revenue',
    value: '$48,200',
    change: '+12.5% from last month',
    icon: DollarSign,
  },
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <StatCard title="Total Revenue" value="$48,200" change="+12.5%" icon={DollarSign} />
      <StatCard title="Active Projects" value="24" change="+3 this week" icon={FolderKanban} />
      <StatCard title="Team Members" value="18" change="+2 new hires" icon={Users} />
      <StatCard title="Conversion" value="3.8%" change="+0.6%" icon={TrendingUp} />
    </div>
  ),
}
