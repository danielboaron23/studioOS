import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { toast } from 'sonner';

import { Toaster } from './sonner';
import { Button } from './button';

const meta: Meta<typeof Toaster> = {
  title: 'Primitives/Toast',
  component: Toaster,
  decorators: [
    (Story) => (
      <>
        <Story />
      </>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Toasts via `sonner`. Mount `<Toaster />` once at the app root, then call `toast(...)`, `toast.success(...)`, `toast.error(...)`. Colors come from the popover tokens.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Toaster />
      <Button variant="outline" onClick={() => toast('Agent ID copied')}>Default</Button>
      <Button variant="outline" onClick={() => toast.success('Agent saved')}>Success</Button>
      <Button variant="outline" onClick={() => toast.error('Could not save agent')}>Error</Button>
      <Button variant="outline" onClick={() => toast.info('Version v1 created')}>Info</Button>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() => toast('Do you want to create an API key?', { action: { label: 'Create key', onClick: () => {} } })}
      >
        With action
      </Button>
    </>
  ),
};
