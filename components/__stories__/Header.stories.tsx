import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Header } from '@/components/header'
import { SidebarProvider } from '@/components/ui/sidebar'

const meta = {
  title: 'App/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
