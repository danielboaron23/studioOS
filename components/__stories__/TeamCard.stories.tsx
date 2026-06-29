import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { TeamCard } from '@/components/team-card'

const meta = {
  title: 'Team/TeamCard',
  component: TeamCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    member: {
      name: 'Maya Rodriguez',
      role: 'Lead Product Designer',
      fallbackColor: '#7F77DD',
      socials: {
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        youtube: 'https://youtube.com',
      },
    },
  },
} satisfies Meta<typeof TeamCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoSocials: Story = {
  args: {
    member: {
      name: 'Leo Park',
      role: 'Motion Designer',
      fallbackColor: '#1D9E75',
    },
  },
}
