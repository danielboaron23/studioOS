import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const meta = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="discovery">Discovery</SelectItem>
        <SelectItem value="design">Design</SelectItem>
        <SelectItem value="review">Review</SelectItem>
        <SelectItem value="handoff">Handoff</SelectItem>
        <SelectItem value="done">Done</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Grouped: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Assign to…" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Design</SelectLabel>
          <SelectItem value="maya">Maya Rodriguez</SelectItem>
          <SelectItem value="leo">Leo Park</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Engineering</SelectLabel>
          <SelectItem value="ana">Ana Costa</SelectItem>
          <SelectItem value="sam">Sam Reed</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}
