import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { IncomeChart } from '@/components/income-chart'

const meta = {
  title: 'Dashboard/IncomeChart',
  component: IncomeChart,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[640px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IncomeChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
