import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Label } from './label';
import { Checkbox } from './checkbox';
import { Input } from './input';

const meta: Meta<typeof Label> = {
  title: 'Primitives/Label',
  component: Label,
  parameters: {
    docs: {
      description: {
        component:
          'Label built on `radix-ui`. Associates with a form control via `htmlFor` or by wrapping. Use with `Checkbox`, `RadioGroup`, `Switch`, `Input`, etc.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="label-email">Email</Label>
      <Input type="email" id="label-email" placeholder="you@example.com" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="label-terms" />
      <Label htmlFor="label-terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="disabled-cb" disabled />
      <Label htmlFor="disabled-cb">Disabled option</Label>
    </div>
  ),
};
