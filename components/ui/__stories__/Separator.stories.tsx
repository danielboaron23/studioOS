import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Separator } from '@/components/ui/separator'

const meta = {
  title: 'UI/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <p className="text-sm font-medium">Studio OS</p>
      <p className="text-muted-foreground text-sm">Design operations platform</p>
      <Separator className="my-3" />
      <div className="flex h-5 items-center gap-3 text-sm">
        <span>Projects</span>
        <Separator orientation="vertical" />
        <span>Tasks</span>
        <Separator orientation="vertical" />
        <span>Team</span>
      </div>
    </div>
  ),
}
