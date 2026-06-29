import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ProjectsTable } from '@/components/projects-table'

const meta = {
  title: 'Projects/ProjectsTable',
  component: ProjectsTable,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ProjectsTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
