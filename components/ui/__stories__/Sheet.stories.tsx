import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

function Demo({ side }: { side?: 'top' | 'right' | 'bottom' | 'left' }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open {side ?? 'right'} sheet</Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>New project</SheetTitle>
          <SheetDescription>Create a project and invite your team.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 px-4">
          <Input placeholder="Project name" />
          <Input placeholder="Client" />
        </div>
        <SheetFooter>
          <Button>Create</Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export const Right: Story = { render: () => <Demo side="right" /> }
export const Left: Story = { render: () => <Demo side="left" /> }
export const Bottom: Story = { render: () => <Demo side="bottom" /> }
