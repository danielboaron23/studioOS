import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { KanbanBoard } from '@/components/kanban-board'

const meta = {
  title: 'Tasks/KanbanBoard',
  component: KanbanBoard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof KanbanBoard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
