import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { RecentSales } from '@/components/recent-sales'

const meta = {
  title: 'Dashboard/RecentSales',
  component: RecentSales,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RecentSales>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
